// cut string title

export const cutStringTitle = (string) => {
    if(string.length < 25) return string;
    return string.slice(0, 25) + "...";
}

// cut string content

export const cutStringContent = (string) => {
    const cutString = string.slice(0, 150) + "...";
    if(string.length < 150) return { isDetails: true, content: string, cutString };
    return { isDetails: false, content: cutString , cutString };
}

// change Time

export const changeTime = (time) => {
    const t = Date.now();
    const dentaTime = (t - time) / 1000;
    if(dentaTime < 60) return "Vừa xong";
    if(dentaTime < 3600) return `${Math.floor(dentaTime/60)} phút trước`;
    if(dentaTime < 86400) return `${Math.floor(dentaTime/3600)} giờ trước`;
    const newTime = new Date(time);
    return newTime.toLocaleTimeString() + " " + newTime.toLocaleDateString();
}

// change string
export const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    return str;
}