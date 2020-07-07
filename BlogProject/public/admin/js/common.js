function serializeFormDataToJson(form) {
    var dataInJSON = {};
    let formData = form.serializeArray();
    formData.forEach((item)=>{
        dataInJSON[item.name] = item.value;
    });
    return dataInJSON;
}


function getLocalTime(time) {
    let timeNow = new Date(time || Date.now());
    timeNow.setMinutes(timeNow.getMinutes() - timeNow.getTimezoneOffset());
    return timeNow.toISOString();
}