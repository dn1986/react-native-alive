// 문자열이 빈 문자열인지 체크하여 결과값을 리턴
// str : 체크할 문자열
export const isEmpty = (str) => {
    if(typeof str == "undefined" || str == null || str == "")
        return true;
    else
        return false ;
}

// 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴
// str : 체크할 문자열
// defaultStr : 문자열이 비어있을경우 리턴할 기본 문자열
export const nvl = (str, defaultStr) => {
    if(typeof str == "undefined" || str == null || str == "")
        str = defaultStr ;
    
    return str ;
}

// 현재 날짜를 구하여 리턴
export const getDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const hour = today.getHours();
    const min = today.getMinutes();

    return year + "-" + month + "-" + date + " " + hour + ":" + min;
}