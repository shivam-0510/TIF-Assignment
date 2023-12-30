const {Snowflake}=require("@theinternetfolks/snowflake");

exports.generateId=()=>{
    return Snowflake.generate();
}