import format from "./format";

const currentWeek =(date)=> {
    date = new Date(date);
    const cd = date.getDate();
    date.setDate(1);
    const fdw = date.getDay();
    const fmonday = (9-fdw)%7 || 7;
    const wn = Math.floor((cd-fmonday)/7)+1;
    const startDate = new Date();
    startDate.setDate(fmonday+7*(wn-1));
    const entDate = new Date();
    entDate.setDate(fmonday+7*wn-1);
    return {
        start:format(startDate),
        end:format(entDate),
        weekNum:wn,
        lastMonthWeek:wn?0:currentWeek(startDate).weekNum
    };
};

export default currentWeek