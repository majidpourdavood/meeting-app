module.exports = {
  apps : [{
    name   : "sesami",
    script : "./app.js",
    error_file : "./err.log",
    out_file : "./out.log",
    log_type: "json",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    log_max_size: "10M"
  }]
}