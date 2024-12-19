
// Fires before the record is created
onRecordCreateRequest((e) => {
    try {
        const record = e.record;
        if (!record) return e.next();

        // Find all meta fields and their corresponding file fields
        const fields = Object.keys(record.fieldsData());
        const metaFields = fields.filter(field => field.endsWith('_meta'));
        
        // Early return if no meta fields found
        if (metaFields.length === 0) return e.next();

        for (const metaField of metaFields) {
            const fileField = metaField.replace('_meta', '');
            const files = record.get(fileField);

            // Skip if no files to process
            if (!files || (Array.isArray(files) && files.length === 0)) {
                continue;
            }

            // Process files
            const fileList = Array.isArray(files) ? files : [files];
            const metadata = fileList.map(file => {
                if (!file) return null;
                return {
                    [file.name]: {
                        size: file.size,
                        type: file.type || file.name.split('.').pop(),
                        originalName: file.originalName,
                        created: new Date().toISOString(),
                        updated: new Date().toISOString()
                    }
                };
            }).filter(Boolean);

            if (metadata.length > 0) {
                record.set(metaField, metadata);
            }
        }

        return e.next();
    } catch (err) {
        console.error("Error processing file metadata:", err);
        return e.next();
    }
});

// Fires before the record is updated
onRecordUpdateRequest((e) => {
    try {
        const record = e.record;
        const fields = Object.keys(record.fieldsData());
        const metaFields = fields.filter(field => field.endsWith('_meta'));

        if (metaFields.length === 0) return e.next();

        for (const metaField of metaFields) {
            const fileField = metaField.replace('_meta', '');
            const files = record.get(fileField);
            
            let currentMetadata = {};
            const record_json = JSON.parse(JSON.stringify(record));
            currentMetadata = record_json[`${metaField}`];

            // Handle case when all files are removed
            if (!files || (Array.isArray(files) && files.length === 0)) {
                record.set(metaField, {});
                continue;
            }

            // Get list of current files
            const fileList = Array.isArray(files) ? files : [files];
            
            // Create new metadata object starting with existing metadata
            const updatedMetadata = { ...currentMetadata };

            // Get current file names (both string references and new file objects)
            const currentFileNames = fileList.map(file => 
                typeof file === 'string' ? file : file?.name
            ).filter(Boolean);

            // Remove metadata for deleted files
            Object.keys(updatedMetadata).forEach(fileName => {
                if (!currentFileNames.includes(fileName)) {
                    delete updatedMetadata[fileName];
                }
            });

            // Add or update metadata for each file
            for (const file of fileList) {
                if (!file || !file.name) continue;

                // If it's a string, it's an existing file that hasn't changed
                if (typeof file === 'string') {
                    if (currentMetadata[file]) {
                        updatedMetadata[file] = currentMetadata[file];
                    }
                    continue;
                }

                // Handle new or updated files
                updatedMetadata[file.name] = {
                    size: file.size,
                    type: file.type || (file.name && file.name.split('.').pop()) || 'unknown',
                    originalName: file.originalName,
                    created: currentMetadata[file.name]?.created || new Date().toISOString(),
                    updated: new Date().toISOString()
                };
            }

            // Update the metadata field
            record.set(metaField, updatedMetadata);
        }

        return e.next();
    } catch (err) {
        console.error("Error processing file metadata on update:", err);
        return e.next();
    }
});