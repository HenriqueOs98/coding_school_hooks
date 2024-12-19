/// <reference path="../types.d.ts" />

// Fires before the record is created
onRecordCreateRequest((e) => {
    console.log("Hello, World!");
    return e.next();
});

// Fires before the record is updated
onRecordUpdateRequest((e) => {
    console.log("Hello, World!");
    return e.next();
});create a script that thakes data from the csvs in cms_cost_reports extracted, look for files that ends in  _rpt.csv and parse the ocntent to that table 

CREATE OR REPLACE TABLE CMS_RAW.SNF.COSTREPORT_SNF_FISCAL_YEAR (