const DAY = 24 * 60 * 60 * 1000;

/* UTC(Coordinated Universal Time) 时区转换 */
//-24小时补全机制 2019-01-01 00:00:00
const localOptionsFull = {
  weekday: "long",
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
  hour12: false
// timeZone: 'UTC' 
};
//-12小时机制非补全机制 2019-1-1 0:00:00
const localOptions = {
  weekday: "long",
  year: "2-digit", month: "numeric", day: "numeric",
  hour: "numeric", minute: "numeric", second: "numeric",
  // hour12: true
};

export const formatDateLocal = (date, isDebug) => {
  const format = (idate) => (new Date(idate)).toLocaleString(localOptionsFull);

  if(Array.isArray(date)) {
    date = date.map(idate => format(idate));
  } else {
    date = format(date);
  }
  isDebug && (console.log(date));
  return date;
}

// ===================================
// 【 日期时间方法 】 
//  **  无时区限制 具体显示应用上层控制
// ===================================

/* 日期时间点  */

// ------【日期时间点 时间】-------
/**
 * 设置指定日期的时间  x年x月x日 HH:MM:SS.MS/hh:mm:ss.ms
 * @param {Date} date 指定日期
 * @param {Array} times [时,分,秒,毫秒]
 * @return {Date} date x年x月x日 00:00:00.000 (默认)
 * **  无时区限制 具体显示应用上层控制
 */
export const setTime = ( date=new Date(), times=[]) => {
  let [ 
    hour=0,
    minute=0,
    second=0,
    millisecond=0
  ] = times;

  date = (new Date(date));
  (date != 'Invalid Date')&& date.setHours(hour, minute, second, millisecond);
  // date.setHours(hour);
  // date.setMinutes(minute);
  // date.setSeconds(second);
  // date.setMilliseconds(millisecond);
  return date;
};
/**
 * 
 * @param {*} date 指定日期
 * @param {array} options [年，月，日] [year,month,day] e.g. 只设置日 [0,0,day]
 * @param {number,boolean} point 是否取自然日  0-不取(默认)|1-取  
 * @description 取自然日有 2 种情况： 
 *                 ① 参照日期 < 目标日期  则向前取自然日
 *                 ② 参照日期 >= 目标日期 则向后取自然日
 * @return {*} date
 *  e.g.  根据日期2019-02-06 06:06:06.666 设置2月29号
 *  0,false 不取自然日 (2019-02-06 06:06:06.666, [0,2,29],0) => 2019-03-01 06:06:06.666 
 *  1,true    取自然日 ① (2019-02-06 06:06:06.666, [0,2,29],1) => 2019-02-28 06:06:06.666 (referDate<targetDate 向前取值)
 *                   ② (2019-03-06 06:06:06.666, [0,2,29],1) => 2019-03-01 06:06:06.666 (referDate>=targetDate 向后取值)
 */
// export const setDate = (date=new Date(), [ year=0, month=0, day=0], point=0) => {
//   let referDate = new Date(date);
//   let targetDate = new Date();
//   formatDateLocal(referDate,1);
//   if( referDate != 'Invalid Date') {
//     year&&targetDate.setFullYear(year);
//     month&&targetDate.setMonth(month);
//     day&&targetDate.setDate(day);
//     formatDateLocal(targetDate,1);
//     if(point) {
//       const targetMonth = targetDate.getMonth();

//       if(targetMonth !== month ) {
//         if(targetDate-referDate >= 0) {
//           targetDate.setDate(day-targetDate.getDate());
//           targetDate.setMonth(month);
//         } else {
//           targetDate.setDate(1);
//         }
//       }

//     }
//   }
//   return targetDate;
// };

export const setDate = (date=new Date(), [ year=0, month=0, day=0], point=0) => {
  let referDate = new Date(date);
  let targetDate;
  // formatDateLocal(referDate,1);
  if( referDate != 'Invalid Date') {
    if(point) {
      let dateDiff = 0; //日期差值 referDate-targetDate
      targetDate = new Date();
      const referYear = referDate.getFullYear();
      year ? !dateDiff&&(dateDiff = referYear-year) : ( year = referYear);
      targetDate.setFullYear(year);
      const referMonth = referDate.getMonth();
      month ? !dateDiff&&(dateDiff = referMonth-month) : ( month = referMonth);
      targetDate.setMonth(month);
      const referDay = referDate.getDate();
      day ? !dateDiff&&(dateDiff = referDay-day) : ( day = referDay);
      targetDate.setDate(day);
      // formatDateLocal(targetDate,1);
      // console.log(`diff ${dateDiff}`);
      const targetMonth = targetDate.getMonth();
      if(targetMonth !== month ) {
        if(dateDiff>=0) {//向后取值
          targetDate.setDate(1);
        } else {// 向前取值
          targetDate.setDate(day-targetDate.getDate());
          targetDate.setMonth(month);
        }
      }
    } else {
      targetDate = new Date(date);
      year&&targetDate.setFullYear(year);
      month&&targetDate.setMonth(month);
      day&&targetDate.setDate(day);
      // formatDateLocal(targetDate,1);
    }
  }
  return targetDate;
};
// formatDateLocal(setDate('2019-02-04 06:06:06.666', [0,1,29],1),1); // 2019-2-28 16:19:24
// formatDateLocal(setDate('2019-03-04 06:06:06.666', [0,1,29],1),1); // 2019-3-1 16:19:24
// formatDateLocal(setDate('', [0,1,29],1),1); // 2019-3-1 16:19:24

const MonthEndDays = [29,30,31]; // 28号每月均有

export const setDayBegin = date => setTime(date, [0,0,0,0]); // yyyy年MM月dd日 00:00:00.000
export const setDayEnd = date => setTime(date, [23,59,59,999]);// yyyy年MM月dd日 23:59:59.999
/**
 * 设置指定日期的-日临界
 * @param {*} date 指定日期  y年M月d日 h时m分s秒ms毫秒
 * @param {number} point 时间临界界点 point ∈ [-1,0,1]
*   @point-attr -1 零点     yyyy年MM月dd日 00:00:00.000
*   @point-attr  0 即时即刻  yyyy年MM月dd日 hh:mm:ss.ms
*   @point-attr  1 最后一毫秒 yyyy年MM月dd日 23:59:59.999
 * @return {*} date
 */
export const setDayBoundary = (date, point=0) => 
 ( point === -1 ? setDayBegin(date)
     : point === 1 ? setDayEnd(date)
     : new Date(date)
 );
// console.log(setDayBoundary('2019-02-29 06:06:06.666', 0));

export const setMonthBegin = date => setDayBegin(setDate(date,[0,0,1]));
export const setMonthEnd = date => {
  date = new Date(date);
  const nextMonth = date.setMonth(date.getMonth()+1);
  const monthEnd = setMonthBegin(nextMonth) - 1;
  return new Date(monthEnd);
};
// console.log(setMonthBegin('2019-02-29 06:06:06.666'));
// console.log(setMonthEnd('2019-02-29 06:06:06.666'));
/**
 * 当月最后一日
 * @param {*} date 
 * nextMonthFirstDay - 1 
 */
export const getMonthLastDay = date => {
  date = new Date(date);
  const referDate = new Date(JSON.parse(JSON.stringify(date)));
  const nextMonth = date.setMonth(date.getMonth()+1);
  const monthEnd = date.setDate(1) - DAY;
  return new Date(monthEnd);
};
// console.log(getMonthLastDay('2019-02-29 06:06:06.666'));
export const setMonthBoundary = (date, point=-1) => ( point===-1 ? setMonthBegin(date) : point===1 ? setMonthEnd(date) : new Date(date));

// console.log(setMonthBoundary('2019-02-29 06:06:06.666',0));

export const setYearBegin = date => setDayBegin(setDate(date,[0,1,1])); //yyyy年01月01日 00:00:00.000
export const setYearEnd = date => setDayEnd(setDate(date,[0,11,31])); //yyyy年12月31日 23:59:59.999
/**
 * 设置指定日期的-年临界
 * @param {*} date 指定日期 y年M月d日 h时m分s秒ms毫秒
 * @param {number} point 年临界点 point ∈ [-1,0,1]  
 *   @point-attr -1 1月1日零点   yyyy年01月01日 00:00:00.000
 *   @point-attr  0 当月当日即时即刻  yyyy年MM月dd日 hh:mm:ss.ms
 *   @point-attr  1 12月31日最后一毫秒 yyyy年12月31日 23:59:59.999
 * @return {*} date  y年M月d日 00:00:00.000
 */
export const setYearBoundary = (date, point=-1) => ( point===-1 ? setYearBegin(date) : point===1 ? setYearEnd(date) : new Date(date));

// console.log(setYearBegin('2019-02-29 06:06:06.666',0));
// console.log(setYearEnd('2019-02-29 06:06:06.666',0));
// console.log(setYearBoundary('2019-02-29 06:06:06.666',1));


/**
 * 设置指定日期的 临界点
 * @param {*} date 指定日期  y年M月d日 h时m分s秒ms毫秒
 * @param {object} refer { to:'month', value: ''}  to ∈ [ 'day','month','year']  value ∈ Z
 * @param {string} boundary 临界点  boundary 
 *  场景① 日期临界点 point = parseInt(t,2) ∈ -1~1 
 *      e.g.  2019-02-30 06:06:06.666 [日临界] dayPoint
 *         -1 起始点[第一时刻,第一天,第一个月]  2019-03-02 00:00:00.000
 *          0 正点[即时即刻]  2019-03-02 06:06:06.666
 *          1 终止点[最后一时刻,最后一天,最后一个月] 
 *  场景② 组合临界点 point = parseInt(td,2) ∈ -3~3  '00', '01'可简写为'0' '1'
 *    e.g.  2019-02-30 06:06:06.666 [日临界][自然日临界] [dayPoint][naturalPoint]
 *    ['-11','01','11'] => point ∈ [-3,1,3]  day ∈ [29,30,31]取自然日  2019-03-02 => 2019-02-28
 *       ['-10', '-11'] => point ∈ [-3,-2]   date 第一毫秒/日/月  2019-03-02(2019-02-28) 00:00:00.000
 *         ['00', '01'] => point ∈ [0,1]     date 第一毫秒/日/月  2019-03-02(2019-02-28) 06:06:06.666
 *         ['10', '11'] => point ∈ [2,3]     date 最后一毫秒/日/月 2019-03-02(2019-02-28) 23:59:59.999
 * @return {*} date
 */
export const setDateBoundary = (date=new Date(), refer, boundary='00' ) => {
  const { to='day', value=1} = refer;
  date = new Date(date);
  const point = parseInt(boundary.toString(), 2);
  
  const isCombo = String(Math.abs('-11')).length===2; // 组合临界点
  let naturalPoint = 0; // 特殊日期取自然日处理
  let datePoint = 0; // 日期临界点
  // '00' 不需要临界处理
  //if(!point) {  } 
      
  const referDay = date.getDate();
 // console.log(isCombo,MonthEndDays.includes(referDay), to=='day' && MonthEndDays.includes(value));
  if( isCombo ) {
    const needNatural = MonthEndDays.includes(referDay) || to=='day' && MonthEndDays.includes(value);
    naturalPoint = needNatural && [-3,1,3].includes(point);
    
    datePoint = point<0 ? -1 : point > 1 ? 1 : 0; 
  } else {
    datePoint = point;
  }
  

  let referMonth = date.getMonth();
  switch(to) {
    case 'day': {
        date = setDate(date,[0, referMonth, value], naturalPoint);
        date = setDayBoundary(date, datePoint);
      break;
    }
    case 'month': {
      date = setDate(date,[0,value, referDay], naturalPoint);
      date = setDayBoundary(date, datePoint);
      break;
    }
    case 'year': {
      date = setDate(date,[value, referMonth, referDay], naturalPoint);
      date = setDayBoundary(date, datePoint);
      break;
    }
    default:
      return;
  }
  return date;
};
// console.log(setDateBoundary('2019-02-20 06:06:06.666', {to:'day', value: 29},'-11')); //Thu Feb 28 2019 00:00:00 GMT+0800 (中国标准时间)
// console.log(setDateBoundary('2019-02-20 06:06:06.666', {to:'day', value: 29},'-10')); //Fri Mar 01 2019 00:00:00 GMT+0800 (中国标准时间)
// console.log(setDateBoundary('2019-02-29 06:06:06.666', {to:'month', value: 2},'11')); // Fri Mar 01 2019 23:59:59 GMT+0800 (中国标准时间)
// console.log(setDateBoundary('2019-02-29 06:06:06.666', {to:'year', value: 2019},'-11')); //Fri Mar 01 2019 23:59:59 GMT+0800 (中国标准时间)

export const setDay = (day=1, date=new Date(), boundary='00') => {
   date = new Date(date);
   return setDateBoundary(date,{to:'day', value: day}, boundary);
};

// console.log(setDay(29,'2019-02-28 06:06:06.666','-11'));  // Thu Feb 28 2019 00:00:00 GMT+0800 (中国标准时间)
export const setMonth = (month=1, date=new Date(), boundary='00') => {
   date = new Date(date);
  
   return setDateBoundary(date, {to: 'month', value: month}, boundary);
};
// console.log(setMonth(1,'2019-01-30 06:06:06.666')); //Sat Mar 30 2019 06:06:06 GMT+0800 (中国标准时间)
// console.log(setMonth(1,'2019-01-30 06:06:06.666','-10')); //Sat Mar 30 2019 00:00:00 GMT+0800 (中国标准时间)
// console.log(setMonth(1,'2019-01-30 06:06:06.666','-11')); //Thu Feb 28 2019 00:00:00 GMT+0800 (中国标准时间)

export const setYear = (year=1, date=new Date(), boundary='00') => {
   date = new Date(date);
   return setDateBoundary(date, {to: 'year', value: year}, boundary);
};
// console.log(setYear(2019,'2000-02-29 06:06:06.666')); // Fri Mar 01 2019 06:06:06 GMT+0800 (中国标准时间)
// console.log(setYear(2019,'2000-02-29 06:06:06.666','-10')); //Fri Mar 01 2019 00:00:00 GMT+0800 (中国标准时间)
// console.log(setYear(2019,'2000-02-29 06:06:06.666','-11')); //Thu Feb 28 2019 00:00:00 GMT+0800 (中国标准时间)

export const setOffsetDay = (offset=1, date=new Date(), boundary) => {
  date = new Date(date);
  const targetDay = date.getDate()+offset;
  date = setDay(targetDay, date, boundary);
  return date;
};
export const setOffsetWeek = (offset=1, date=new Date(), boundary) => {
  date = new Date(date);
  const targetDay = date.getDate()+offset*7;
  date = setDay(targetDay, date,  boundary);
  return date;
};
// console.log(setOffsetDay(2,'2000-02-28 06:06:06.666'));// Mon Feb 28 2000 06:06:06 GMT+0800 (中国标准时间)
// console.log(setOffsetDay(2,'2000-02-28 06:06:06.666','-11'));//Tue Feb 29 2000 00:00:00 GMT+0800 (中国标准时间)
// console.log(setOffsetDay(2,'2000-02-28 06:06:06.666','-10'));//Wed Mar 01 2000 00:00:00 GMT+0800 (中国标准时间)
// console.log(setOffsetWeek(1,'2000-02-28 06:06:06.666'));// Mon Feb 28 2000 06:06:06 GMT+0800 (中国标准时间)
// console.log(setOffsetWeek(1,'2000-02-28 06:06:06.666','-11'));//Mon Mar 06 2000 00:00:00 GMT+0800 (中国标准时间)
// console.log(setOffsetWeek(1,'2000-02-28 06:06:06.666','-10'));//Mon Mar 06 2000 00:00:00 GMT+0800 (中国标准时间)

export const setOffsetMonth = (offset=1, date=new Date(), boundary) => {
  date = new Date(date);
  const targetMonth = date.getMonth()+offset;
  date = setMonth(targetMonth, date, boundary);
  return date;
};
// console.log(setOffsetMonth(1,'2000-01-30 06:06:06.666'));// Thu Mar 30 2000 06:06:06 GMT+0800 (中国标准时间)
// console.log(setOffsetMonth(-1,'2000-03-30 06:06:06.666','-11'));//Tue Feb 29 2000 00:00:00 GMT+0800 (中国标准时间)
// console.log(setOffsetMonth(1,'2000-01-30 06:06:06.666','10'));//Thu Mar 30 2000 23:59:59 GMT+0800 (中国标准时间)

export const setOffsetYear = (offset=1, date=new Date(), boundary) => {
  date = new Date(date);
  const targetYear = date.getFullYear()+offset;
  date = setYear(targetYear, date, boundary);
  return date;
};
// console.log(setOffsetYear());
// console.log(setOffsetYear(19,'2000-02-29 06:06:06.666'));//Fri Mar 01 2019 06:06:06 GMT+0800 (中国标准时间)
// console.log(setOffsetYear(19,'2000-02-29 06:06:06.666','-11'));//Fri Mar 01 2019 06:06:06 GMT+0800 (中国标准时间)
// console.log(setOffsetYear(19,'2000-02-29 06:06:06.666','10'));//Fri Mar 01 2019 23:59:59 GMT+0800 (中国标准时间)

//===========================================
// 时间区间|区间时长
//===========================================
export const dateSort = (period) => {
   period.sort((a,b)=> a.getTime()-b.getTime());
   return period;
};

export const dateDuration = (period) => {
  period = period[1]-period[0];
  return period;
};
//------------------------------------
// 即时即刻时间区间|时长   即时即刻 ～ 即时即刻
//------------------------------------
export const periodYear=(offset=1, date=new Date(), isDuration=0) => {
  const period = dateSort([ new Date(date), setOffsetYear(offset, date, '01')]);
  return isDuration ?  dateDuration(period) : period; 
};

// console.log(periodYear(19,'2000-02-29 06:06:06.666')); //[Tue Feb 29 2000 06:06:06 GMT+0800 (中国标准时间), Thu Feb 28 2019 06:06:06 GMT+0800 (中国标准时间)]
// console.log(periodYear(19,'2000-02-29 06:06:06.666',1)); // 599529600000≈19*365  599529600000/(24*60*60*1000*19)=365.2105263157895天

export const periodMonth=(offset=1, date=new Date(), isDuration=0) => {
  const period = dateSort([ new Date(date), setOffsetMonth(offset, date, '01')]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodMonth(1,'2019-01-30 06:06:06.666'));//[Wed Jan 30 2019 06:06:06 GMT+0800 (中国标准时间), Thu Feb 28 2019 06:06:06 GMT+0800 (中国标准时间)]
// console.log(periodMonth(1,'2019-01-30 06:06:06.666', 1)); // 2505600000 2505600000/(24*60*60*1000)=29天

export const periodDay=(offset=1, date=new Date(), isDuration=0) => {
  const period = dateSort([ new Date(date), setOffsetDay(offset, date, '00')]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodDay(null,null,0));
// console.log(periodDay(30,'2019-01-30 06:06:06.666')); // [Wed Jan 30 2019 06:06:06 GMT+0800 (中国标准时间), Fri Mar 01 2019 06:06:06 GMT+0800 (中国标准时间)]
// console.log(periodDay(30,'2019-01-30 06:06:06.666',1)); // 2592000000 2592000000/(24*60*60*1000) = 30天

//-----------------------------------------------
// 起止时间区间|时长  最近时间不含今天  零点～最后一刻
//-----------------------------------------------

export const periodRecentYear=(offset=1, date=new Date(), isDuration=0) => {
  date = new Date(date);
  let referDate, offsetDate;
  if(offset < 0) {
    referDate = setDayEnd(date);
    offsetDate = setOffsetYear(offset, date, '-11');
  } else {
    referDate = setDayBegin(date);
    offsetDate = setOffsetYear(offset, date, '11');
  }
  const period = dateSort([referDate, offsetDate]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodRecentYear(0));//当前 [Wed Mar 20 2019 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentYear()); //默认将来最近一年 [Wed Mar 20 2019 00:00:00 GMT+0800 (中国标准时间), Fri Mar 20 2020 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentYear(-1)); //过去最近一年 [Tue Mar 20 2018 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentYear(-19,'2019-02-28 06:06:06.666')); //[Tue Feb 29 2000 00:00:00 GMT+0800 (中国标准时间), Thu Feb 28 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentYear(-19,'2019-02-28 06:06:06.666',1));// 599615999999≈19*365  599615999999/(24*60*60*1000*19)=365.2631578941277
// console.log(periodRecentYear(19,'2000-02-29 06:06:06.666')); // [Tue Feb 29 2000 00:00:00 GMT+0800 (中国标准时间), Fri Mar 01 2019 23:59:59 GMT+0800 (中国标准时间)]



export const periodRecentMonth=(offset=1, date=new Date(), isDuration=0) => {
  date = new Date(date);
  let referDate, offsetDate;
  if(offset < 0) {
    referDate = setDayEnd(date);
    offsetDate = setOffsetMonth(offset, date, '-11');
  } else {
    referDate = setDayBegin(date);
    offsetDate = setOffsetMonth(offset, date, '11');
  }
  const period = dateSort([referDate, offsetDate]);
  return isDuration ?  dateDuration(period) : period; 
};

// console.log(periodRecentMonth(0));//当前 [Wed Mar 20 2019 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentMonth()); //默认将来最近一月 [Wed Mar 20 2019 00:00:00 GMT+0800 (中国标准时间), Sat Apr 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentMonth(-1)); //过去最近一月 [Wed Feb 20 2019 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentMonth(1,'2019-01-30 06:06:06.666')); //[Wed Jan 30 2019 00:00:00 GMT+0800 (中国标准时间), Thu Feb 28 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentMonth(1,'2019-01-30 06:06:06.666',1));// 2591999999 2591999999/(24*60*60*1000)=29.999999988425927
// console.log(periodRecentMonth(-1,'2019-03-29 06:06:06.666')); // [Thu Feb 28 2019 00:00:00 GMT+0800 (中国标准时间), Fri Mar 29 2019 23:59:59 GMT+0800 (中国标准时间)]
// formatDateLocal(periodRecentMonth(-1,'2019-03-29 06:06:06.666'),1);//[ '2019-3-01 00:00:00', '2019-3-29 23:59:59' ]
// formatDateLocal(periodRecentMonth(1,'2019-01-29 06:06:06.666'),1);//[ '2019-1-29 00:00:00', '2019-2-28 23:59:59' ]

export const periodRecentDay=(offset=1, date=new Date(), isDuration=0) => {
  date = new Date(date);
  let referDate, offsetDate;
  if(offset < 0) {
    referDate = setDayEnd(date);
    offsetDate = setOffsetDay(offset, date, '-11');
  } else {
    referDate = setDayBegin(date);
    offsetDate = setOffsetDay(offset, date, '11');
  }
  const period = dateSort([referDate, offsetDate]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodRecentDay(0));//当前 [Wed Mar 20 2019 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentDay()); //默认将来最近一天 [Wed Mar 20 2019 00:00:00 GMT+0800 (中国标准时间), Thu Mar 21 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentDay(-1)); //过去最近一天 [Tue Mar 19 2019 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentDay(1,'2019-01-30 06:06:06.666')); //[Wed Jan 30 2019 00:00:00 GMT+0800 (中国标准时间), Thu Jan 31 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodRecentDay(1,'2019-01-30 06:06:06.666',1));// 172799999 172799999/(24*60*60*1000)=1.9999999884259259
// console.log(periodRecentDay(-1,'2019-03-29 06:06:06.666')); // [Thu Mar 28 2019 00:00:00 GMT+0800 (中国标准时间), Fri Mar 29 2019 23:59:59 GMT+0800 (中国标准时间)]


/**
 * 最近一周
 *
 * @param {*} offset ∈ Z(整数)   缺省|undefined|0|1 等效
 * @param {*} date 参照日期
 * @param {*} isDuration  0-区间|1-时长
 * @returns 默认将来一周 日期区间（含参照日期当天）
 */
export const periodRecentWeek=(offset=1, date=new Date(), isDuration=0) => {
  !offset && (offset=1);
  return periodRecentDay(offset*7-1, date, isDuration);
}

//---------------------------------------------
// 起止时间区间|时长  过去时间不含今天  零点～最后一刻
//---------------------------------------------

export const periodPastYear=(offset=-1, date=new Date(), isDuration=0) => {
  date = new Date(date);
  offset = offset>-1 ? -1 : offset;
  // offset = offset>0 ? offset : 1;
  // offset = -1 * offset;
  const referDate = setOffsetDay(-1, date, '11');
  const offsetDate = setOffsetYear(offset, date, '-11');
  const period = dateSort([referDate, offsetDate]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodPastYear()); //默认过去一年 [Mon Mar 19 2018 00:00:00 GMT+0800 (中国标准时间), Tue Mar 19 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodPastYear(-1)); //过去最近一年 [Tue Mar 20 2018 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodPastYear(-19,'2019-02-28 06:06:06.666')); //[Tue Feb 29 2000 00:00:00 GMT+0800 (中国标准时间), Thu Feb 28 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodPastYear(-19,'2019-02-28 06:06:06.666',1));// 599615999999≈19*365  599615999999/(24*60*60*1000*19)=365.2631578941277
// console.log(periodPastYear(19,'2000-02-29 06:06:06.666')); // [Tue Feb 29 2000 00:00:00 GMT+0800 (中国标准时间), Fri Mar 01 2019 23:59:59 GMT+0800 (中国标准时间)]
export const periodPastMonth=(offset=1, date=new Date(), isDuration=0) => {
  date = new Date(date);
  offset = offset>-1 ? -1 : offset;
  // offset = offset>0 ? offset : 1;
  // offset = -1 * offset;
  const referDate = setOffsetDay(-1, date, '10');
  formatDateLocal(referDate,1);
  formatDateLocal(referDate,1);
  const offsetDate = setOffsetMonth(offset, date, '-11');
  const period = dateSort([referDate, offsetDate]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodPastMonth()); 
formatDateLocal(periodPastMonth(-1,'2019-03-30 06:06:06.666'),1); //[Thu Feb 28 2019 00:00:00 GMT+0800 (中国标准时间), Fri Mar 29 2019 23:59:59 GMT+0800 (中国标准时间)]
formatDateLocal(periodPastMonth(-1,'2019-05-01 06:06:06.666'),1);
// console.log(periodPastMonth(-1,'2019-03-30 06:06:06.666',1)); //2591999999  2591999999/(24*60*60*1000)=29.999999988425927

export const periodPastDay=(offset=1, date=new Date(), isDuration=0) => {
  date = new Date(date);
  offset = offset>-1 ? -1 : offset;
  /* offset = offset>0 ? offset : 1;
  offset = -1 * offset; */
  const referDate = setOffsetDay(-1, date, '10');
  const offsetDate = setOffsetDay(offset, date, '-11');
  const period = dateSort([referDate, offsetDate]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodPastDay()); //[Wed Mar 20 2019 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// formatDateLocal(periodPastDay(-1,'2019-03-30 06:06:06.666'),1); //[Thu Feb 28 2019 00:00:00 GMT+0800 (中国标准时间), Fri Mar 29 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodPastDay(-1,'2019-03-30 06:06:06.666',1)); // 86399999 86399999/(24*60*60*1000)=86399999/(24*60*60*1000)

// console.log(periodPastDay()); //[Wed Mar 20 2019 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodPastDay(-1,'2019-03-30 06:06:06.666')); // [Fri Mar 29 2019 00:00:00 GMT+0800 (中国标准时间), Fri Mar 29 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodPastDay(-1,'2019-03-30 06:06:06.666',1)); // 86399999 86399999/(24*60*60*1000)=86399999/(24*60*60*1000)

export const periodPastWeek=(offset=1, date=new Date(), isDuration=0) => {
  offset = offset>-1 ? -1 : offset;
  return periodPastDay(offset*7, date, isDuration);
};

//----------------------------------------------
// 起止时间区间|时长   将来时间不含今天  零点～最后一刻
//----------------------------------------------

export const periodLaterYear=(offset=1, date=new Date(), isDuration=0) => {
  date = new Date(date);
  offset = offset<1 ? 1 : offset;
  const referDate = setOffsetDay(1, date, '-11');
  const offsetDate = setOffsetYear(offset, date, '11');
  const period = dateSort([referDate, offsetDate]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodLaterYear()); //默认之后一年 [Tue Apr 09 2019 00:00:00 GMT+0800 (中国标准时间), Wed Apr 08 2020 23:59:59 GMT+0800 (中国标准时间)

// console.log(periodLaterYear(1)); //之后一年 [Tue Apr 09 2019 00:00:00 GMT+0800 (中国标准时间), Wed Apr 08 2020 23:59:59 GMT+0800 (中国标准时间)
// console.log(periodLaterYear(19,'2000-02-28 06:06:06.666')); //[Tue Feb 29 2000 00:00:00 GMT+0800 (中国标准时间), Thu Feb 28 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodLaterYear(19,'2000-02-28 06:06:06.666',1));// 599615999999≈19*365  599615999999/(24*60*60*1000*19)=365.2631578941277
// console.log(periodLaterYear(-19,'2000-02-29 06:06:06.666')); // [Tue Feb 29 2000 00:00:00 GMT+0800 (中国标准时间), Wed Feb 28 2001 23:59:59 GMT+0800 (中国标准时间)]
export const periodLaterMonth=(offset=1, date=new Date(), isDuration=0) => {
  date = new Date(date);
  offset = offset<1 ? 1 : offset;
  const referDate = setOffsetDay(1, date, '-10');
  const offsetDate = setOffsetMonth(offset, date, '11');
  const period = dateSort([referDate, offsetDate]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodLaterMonth()); //[Tue Apr 09 2019 00:00:00 GMT+0800 (中国标准时间), Wed May 08 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodLaterMonth(1,'2019-01-30 06:06:06.666')); //[Thu Jan 31 2019 00:00:00 GMT+0800 (中国标准时间), Thu Feb 28 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodLaterMonth(1,'2019-01-30 06:06:06.666',1)); //2505599999  2505599999/(24*60*60*1000)=28.999999988425927

export const periodLaterDay=(offset=1, date=new Date(), isDuration=0) => {
  date = new Date(date);
  offset = offset<1 ? 1 : offset;
  const referDate = setOffsetDay(1, date, '-10');
  const offsetDate = setOffsetDay(offset, date, '11');
  const period = dateSort([referDate, offsetDate]);
  return isDuration ?  dateDuration(period) : period; 
};
// console.log(periodLaterDay()); //[Wed Mar 20 2019 00:00:00 GMT+0800 (中国标准时间), Wed Mar 20 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodLaterDay(1,'2019-03-30 06:06:06.666')); //[Sun Mar 31 2019 00:00:00 GMT+0800 (中国标准时间), Sun Mar 31 2019 23:59:59 GMT+0800 (中国标准时间)]
// console.log(periodLaterDay(1,'2019-03-30 06:06:06.666',1)); // 86399999 86399999/(24*60*60*1000)=86399999/(24*60*60*1000)

export const periodLaterWeek=(offset=1, date=new Date(), isDuration=0) => {
  offset = offset<1 ? 1 : offset;
  return periodLaterDay(offset*7, date, isDuration );
};

const dateExact = {
  // constant
  DAY,
  // utils
  dateSort,
  dateDuration,
  formatDateLocal,
  // get
    getMonthLastDay,
  // set
    setTime,
    setDate,
    setDateBoundary,
    setDayBegin,
    setDayEnd,
    setDayBoundary,
    setOffsetDay,
    setMonth,
    setMonthBegin,
    setMonthEnd,
    setMonthBoundary,
    setOffsetMonth,
    setYear,
    setYearBegin,
    setYearEnd,
    setYearBoundary,
    setOffsetYear,
  // range
    periodDay,
    periodMonth,
    periodYear,
    periodRecentDay,
    periodRecentWeek,
    periodRecentMonth,
    periodRecentYear,
    periodPastDay,
    periodPastWeek,
    periodPastMonth,
    periodPastYear,
    periodLaterDay,
    periodLaterWeek,
    periodLaterMonth,
    periodLaterYear
};
export default dateExact;