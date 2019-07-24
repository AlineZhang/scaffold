/**
 * 所有与时间相关的通用方法写这里
 * @type {[type]}
 * v1.0.0 非精确化时间处理
 * v2.0.0 精确化时间处理 （当前）
 */
// import { default as  } from  './dateExact';
import {
  formatDateLocal,
  setOffsetDay,
  setOffsetWeek,
  setOffsetMonth,
  setOffsetYear,
  periodPastDay,
  periodPastWeek,
  periodPastMonth,
  periodPastYear,
  periodLaterDay,
  periodLaterWeek,
  periodLaterMonth,
  periodLaterYear,
  periodRecentDay,
  periodRecentWeek,
  periodRecentMonth,
  periodRecentYear,
  setDayBoundary
} from  './dateExact';
// import { paddingZero } from './number';

const formatHour24 = (time) => {
  time = (time).toString().replace(/^\s|\s$/, '');
  time.length<2 && (time=`0${time}`);
  return time;
}

const paddingZero = formatHour24;

//================================================
// 常量
//================================================
/* 时长 */
export const DAY = 1000*60*60*24;
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY;
export const YEAR = 365 * DAY;
/* 周 */
export const WEEK_MAP = [ '周日','周一','周二','周三','周四','周五','周六' ];
// export const TIME_MAP = [ '上午','下午' ];


//================================================
// 工具 方法
//================================================


//-----------------------------
// 取值
//-----------------------------
/**
 * 24小时 整点
 * @description 获取一天24小时的时间标签
 * @return {[type]} [description]
 */
export const clock24Hours = () => {
  const hoursClock = [];
  for (let i = 1; i < 25; i++) hoursClock.push(i + ':00');

  return hoursClock;
};

export const day2hourlable =clock24Hours; // 兼容非精确化前方法

//-----------------------------
// 检测
//-----------------------------
/**
 * 是否是今天
 * @param  {[type]}  time [description]
 * @return {Boolean}      [description]
 */
export const isToday = time => {
  return (
    timestamp2date(time, 'yyyy-MM-dd') ===
    timestamp2date(+new Date(), 'yyyy-MM-dd')
  );
};

// console.log(isToday(new Date()));
// console.log(isToday(new Date()-DAY));

/**
 * 是否是昨天
 * @param  {[type]}  time [description]
 * @return {Boolean}      [description]
 */
export const isYesterday = time => {
  return (
    timestamp2date(time, 'yyyy-MM-dd') ===
    timestamp2date(+new Date() - DAY, 'yyyy-MM-dd')
  );
};
// console.log(isYesterday(new Date()));
// console.log(isYesterday(new Date()-DAY));
/**
 * 判断两个时间戳是否跨年了
 * @param  {[type]} startTime [description]
 * @param  {[type]} endTime   [description]
 * @return {[type]}           [description]
 */
export const crossYears = (startTime, endTime) => {
  return new Date(endTime).getFullYear() !== new Date(startTime).getFullYear();
};
// console.log(crossYears(new Date('2018-09-02'), new Date('2018-09-03')));
// console.log(crossYears(new Date('2018-09-02'), new Date('2019-09-03')));

/**
 * 日期区间 天
 * @description 根据起止时间，转为按天的时间标签
 * @param  {[type]} startTime [description]
 * @param  {[type]} endTime   [description]
 * @return {[type]}           [description]
 */
export const periodDayLabel = (startTime, endTime) => {
  const dayLabels = [];
  let format = 'MM/dd';
  startTime = new Date(startTime).getTime();
  endTime = new Date(endTime).getTime();
  const len = Math.ceil((endTime - startTime) / DAY); //时间区间一共跨越多少天

  if (crossYears(startTime, endTime)) {
    //如果跨越年了，显示年的标签
    format = 'yyyy/MM/dd';
  }

  for (let l = 0; l < len; l++) {
    dayLabels.push(timestamp2date(startTime + l * DAY, format));
  }

  return dayLabels;
}

export const timesection2daylabel = periodDayLabel; //兼容非精确化处理方法
// console.log(timesection2daylabel(new Date('2018-09-02'), new Date('2018-09-03')));
// console.log(timesection2daylabel(new Date('2018-12-28'), new Date('2019-01-03')));


//-----------------------------
// 格式化fromat
//-----------------------------
/**
 * 时间戳转为日期的格式
 * @param value
 * @param format  可选 默认 'yyyy-MM-dd HH:mm'
 * @returns {*}
 */
export const timestamp2date = (value, format = 'yyyy-MM-dd HH:mm') => {
  if (!value) return '--';

  let maps = {
    yyyy: function(date) {
      return date.getFullYear();
    },
    MM: function(date) {
      return paddingZero(date.getMonth() + 1);
    },
    dd: function(date) {
      return paddingZero(date.getDate());
    },
    HH: function(date) {
      return paddingZero(date.getHours());
    },
    mm: function(date) {
      return paddingZero(date.getMinutes());
    },
    ss: function(date) {
      return paddingZero(date.getSeconds());
    },
  };

  let trunk = new RegExp(Object.keys(maps).join('|'), 'g');

  value = new Date(value || +new Date());

  return format.replace(trunk, function(capture) {
    return maps[capture] ? maps[capture](value) : '';
  });
};
// console.log(timestamp2date(new Date('2018-06-02 08:00'), 'HH:mm:ss')) // 08:00
// console.log(timestamp2date(Date.now())) //2019-05-06 18:01

/**
 * 时间戳转为固定日期格式：今年显示'MM-dd HH:mm', 非今年显示'yyyy-MM-dd HH:mm'
 * @param value
 * @param formatFromMonth 'MM-dd HH:mm:ss'
 * @param abbr 是否缩写成"昨天", "今天"
 * @returns {*}
 */
export const timestamp2fixedDate = (
  value,
  formatFromMonth = 'MM-dd HH:mm',
  abbr = false,
) => {
  if (!value) return '--';

  const nowTime = new Date().getTime();
  // 跨年
  if (crossYears(value, nowTime)) {
    return timestamp2date(value, `yyyy-${formatFromMonth}`);
  } else if (abbr) {
    const nowYear = new Date().getFullYear();
    const nowMonth = new Date().getMonth();
    const nowDate = new Date().getDate();
    const newValue = new Date(value);
    const formatFromHour = formatFromMonth.replace(/^.+HH/, 'HH');
    // 同日
    if (
      nowYear === newValue.getFullYear() &&
      nowMonth === newValue.getMonth() &&
      nowDate === newValue.getDate()
    ) {
      return `今天 ${timestamp2date(value, formatFromHour)}`;
      // 昨日
    } else if (
      nowYear === newValue.getFullYear() &&
      nowMonth === newValue.getMonth() &&
      nowDate === newValue.getDate() + 1
    ) {
      return `昨天 ${timestamp2date(value, formatFromHour)}`;
    }
  }
  // 格式化日期
  return timestamp2date(value, formatFromMonth);
};
//console.log(timestamp2fixedDate(new Date('2018-06-02'))) 2018-06-02 08:00
// console.log(timestamp2fixedDate(Date.now())) 05-06 17:56


/**
 * 待废弃，使用timestamp2fixedDate(value, 'MM-dd HH:mm', true) 替代
 * 时间戳转为固定日期格式：今年显示'MM-dd HH:mm',非今年显示'yyyy-MM-dd HH:mm',今天显示'今天 HH:mm',昨天显示'昨天 HH:mm'
 * @deprecated
 * @param value
 * @returns {*}
 */
export const timestamp2fixedDate1 = value => {
  return timestamp2fixedDate(value, 'MM-dd HH:mm', true);
};

//==============================================
// 时间点
//==============================================
/**
 * 日期零点：某时刻的当天零点，也就是一天的开始
 * @param {Date} [time=new Date()] [description]
 */
// export const DAY_BEGIN = (time = new Date()) => setDayBoundary(time);
export const DAY_BEGIN = (time = new Date()) => {
  if (Number.isInteger(time)) time = new Date(time);
  time.setHours(0, 0, 0, 0);
  return time;
};

/**
 * 日期最后一刻：某时刻的当天23:59:59，也就是一天的结束
 * @param {Date} [time=new Date()] [description]
 */
//  export const DAY_END = (time = new Date()) => setDayBoundary(time, 1);
export const DAY_END = (time = new Date()) => {
  if (Number.isInteger(time)) time = new Date(time);
  time.setHours(23, 59, 59, 999);
  return time;
};

// ------------------------
// 日期差值
// ------------------------
/* 【日期 临界值规则】
 * {[timePoint][naturalDayPoint]} boundary [[时间点临界值][自然日临界值]]
 *       timePoint ∈ [-1,0,1]  -1 起始点[零点] 0 正点[即时即刻]  1 终止点[最后一刻]
 * naturalDayPoint ∈ [0,1]     当day∈ [29,30,31]是否取自然日  取自然日则为自然月最后一日
 * 
 * e.g. 日期2019-02-30 06:06:06.666 [timePoint][naturalDayPoint] 天数差值取值示例 
 *    ['-11','01','11'] => point ∈ [-3,1,3]  day ∈ [29,30,31]取自然日  2019-03-02 => 2019-02-28
 *       ['-10', '-11'] => point ∈ [-3,-2]   date 第一毫秒/日/月  2019-03-02(2019-02-28) 00:00:00.000
 *         ['00', '01'] => point ∈ [0,1]     date 第一毫秒/日/月  2019-03-02(2019-02-28) 06:06:06.666
 *         ['10', '11'] => point ∈ [2,3]     date 最后一毫秒/日/月 2019-03-02(2019-02-28) 23:59:59.999
 */

/**
 * 日期天数 差值
 * @param {*} diff 相差天数 diff为整数 Z
 * @param {*} time Date对象，可选 不传时使用当前时间
 * @param {string} boundary 临界值取值规则 [timePoint][naturalDayPoint] 如 '-11'
 * timePoint ∈ [-1,0,1]  -1 起始点[零点] 0 正点[即时即刻]  1 终止点[最后一刻]
 * naturalDayPoint ∈ [0,1]      当day∈ [29,30,31]是否取自然日  取自然日则为自然月最后一日
*/
export const addDay =  (diff=0, date=new Date(), boundary='0') => {
  date = new Date(date);
  date.setDate(date.getDate()+diff);
  return setDayBoundary(date);
} 
// formatDateLocal(addDay(),1); //2019-5-6 19:20:35
// formatDateLocal(addDay(1,'2019-02-28','-1'),1); // 2019-2-28 00:00:00 详见 dateExact
// formatDateLocal(addDay(-1,'2019-03-01','-1'),1); // 2019-2-28 08:00:00
// formatDateLocal(addDay(30,undefined,'-11'),1);// 2019-6-5 00:00:00 (2019-05-06)
/**
 * 日期 周 差值
 * @param {*} diff 相差周数 diff为整数 Z
 * @param {*} time  Date对象，可选 不传时使用当前时间
 * @param {string} boundary 临界值取值规则 [timePoint][naturalDayPoint] 如 '-11'
 * timePoint ∈ [-1,0,1]  -1 起始点[零点] 0 正点[即时即刻]  1 终止点[最后一刻]
 * naturalDayPoint ∈ [0,1]      当day∈ [29,30,31]是否取自然日  取自然日则为自然月最后一日
 * @return 默认取日期即时即刻
 */
export const addWeek = (diff=0, time, boundary='00') => setOffsetWeek(diff, time, boundary);
// formatDateLocal(addWeek(),1);//2019-5-6 19:24:52
// formatDateLocal(addWeek(1,'2019-02-28','-11'),1); //2019-3-7 00:00:00
// formatDateLocal(addWeek(1,undefined,'-11'),1); //2019-5-13 00:00:00

/**
 * 日期月份 差值
 * @param {*} diff 相差月数 diff为整数 Z
 * @param {*} time  Date对象，可选 不传时使用当前时间
 * @param {string} boundary 临界值取值规则 [timePoint][naturalDayPoint] 如 '-11'
 * timePoint ∈ [-1,0,1]  -1 起始点[零点] 0 正点[即时即刻]  1 终止点[最后一刻]
 * naturalDayPoint ∈ [0,1]      当day∈ [29,30,31]是否取自然日  取自然日则为自然月最后一日
 * @return 默认取日期自然日即时即刻
 */
export const addMonth = (diff=0, time = new Date(), boundary='01') => setOffsetMonth(diff, time, boundary);
// formatDateLocal(addMonth(),1); // 2019-5-6 19:30:50
// formatDateLocal(addMonth(1,undefined,'-11'),1); //2019-6-6 00:00:00
// formatDateLocal(addMonth(1,'2018-01-29','-11'),1); //2018-2-28 00:00:00
// formatDateLocal(addMonth(-1,'2018-03-29','-11'),1); // 2018-3-1 00:00:00

/**
 * 日期年份 差值
 * @param {*} diff 相差年数 diff为整数 Z
 * @param {*} time Date对象，可选，不传时使用当前时间
 * @param {string} boundary 临界值取值规则 [timePoint][naturalDayPoint] 如 '-11'
 * timePoint ∈ [-1,0,1]  -1 起始点 0 正点[即时即刻]  1 终止点
 * naturalDayPoint ∈ [0,1]      当day∈ [29,30,31]是否取自然日  取自然日则为自然月最后一日
 * @result
 *  ① 当前日期天为1～28, 目标日期月份取同一天  如 2000-02-28 19年后 为 2019-02-28 
 *  ② 当前日期天为29,30,31 若目标月份不存在则取最后一天 如 2000-02-29 19年后 为 2019-02-28 
 */
export const addYear = (diff=0, time = new Date(), boundary='01') => setOffsetYear(diff, time, boundary);
// formatDateLocal(addYear(),1); //2019-5-6 21:24:58
// formatDateLocal(addYear(1,undefined,'-11'),1); //2019-5-6 21:24:58
// formatDateLocal(addYear(19,'2000-02-29','-11'),1); //2019-2-28 00:00:0
// formatDateLocal(addYear(-19,'2000-02-29','-11'),1); //1981-3-1 00:00:00


//==============================================
// 起止时间区间 | 区间时长
//==============================================
/**
 * 起止时间|时长 【当前 前后】
 * @param startOffset [timeStamp] 距离今天的时间偏移，ms
 * @param endOffset [timeStamp] 距离今天的时间偏移，ms
 * @return {[type]} [description]
 */
export const getRangeDays = (startOffset=0, endOffset=0) => {
  return [
    DAY_BEGIN(new Date(Date.now() + startOffset)),
    DAY_END(new Date(Date.now() + endOffset)),
  ];
};
// formatDateLocal(getRangeDays(),1); //[ '2019-5-6 00:00:00', '2019-5-6 23:59:59' ]
// formatDateLocal(getRangeDays(DAY*2,DAY*4 ),1); //[ '2019-5-8 00:00:00', '2019-5-10 23:59:59' ]

//--------------------------------------------
// 【过去】时间区间|区间时长   不含今天
//--------------------------------------------
/**
 * 起止时间|时长  【全部有效时间(不含今天)】
 * @description 获取全部的起止时间，不包括今天
 */
export const pastAlltime = () => {
  return [new Date('2015/9/1 0:0:0'), DAY_END(addDay(-1))];
};
// formatDateLocal(pastAlltime(),1);//[ '2015-9-1 00:00:00', '2019-5-5 23:59:59' ]
/**
 * 起止时间|时长  【过去diff天（不含今天）】
 * @description 获取过去diff天的开始时间和结束时间
 * @param {*} diff 相差天数  diff ∈ Z﹣(负整数)
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认昨天时间区间 [xxxx年xx月(xx-1)日 00:00:00, xxxx年xx月(xx-1)日 23:59:59:999] 
 */
export const pastDay = (diff=-1, isDuration=0) => periodPastDay(diff, undefined, isDuration);
// formatDateLocal(pastDay(),1);//[ '2019-5-5 00:00:00', '2019-5-5 23:59:59' ]
// formatDateLocal(pastDay(-5),1);//[ '2019-5-1 00:00:00', '2019-5-5 23:59:59' ]
// console.log(pastDay(-5,1)/DAY); // 4.999999988425926


/**
 * 起止时间|时长  【过去diff周（不含今天）】
 * @description 获取过去diff周的起止时间 
 * @param {*} diff 相差周数  diff ∈ Z﹣(负整数)
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认过去一周时间区间 [xxxx年xx月(xx-1-7)日 00:00:00, xxxx年xx月(xx-1)日 23:59:59:999] 
 */
export const pastWeek = (diff=-1, isDuration) => periodPastWeek(diff, undefined, isDuration);
// formatDateLocal(pastWeek(),1);//[ '2019-4-29 00:00:00', '2019-5-5 23:59:59' ]
// formatDateLocal(pastWeek(-5),1);//[ '2019-4-1 00:00:00', '2019-5-5 23:59:59' ]
// console.log(pastWeek(-5,1)/WEEK); // 4.999999998346561


/**
 * 起止时间|时长  【过去diff个月(不含今天)】
 * @description 获取过去diff个月的起止时间
 * @param {*} diff 相差月数 diff ∈ Z﹣(负整数)
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认过去一个月时间区间 [xxxx年(xx-1)月(xx-1)日 00:00:00, xxxx年xx月(xx-1)日 23:59:59:999]
 */
export const pastMonth = (diff=-1, isDuration=0) => periodPastMonth(diff, undefined,isDuration);
// formatDateLocal(pastMonth(),1);//[ '2019-4-6 00:00:00', '2019-5-5 23:59:59' ]
// formatDateLocal(pastMonth(-5),1);//[ '2018-12-6 00:00:00', '2019-5-5 23:59:59' ]
// console.log(pastMonth(-5,1)/MONTH); // 5.033333332947531

/**
 * 起止时间|时长  【过去diff年(不含今天)】
 * @description 获取过去diff年的起止时间
 * @param {*} diff 相差月数  diff ∈ Z﹣(负整数)
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认过去一年时间区间 [(xxxx-1)年xx月(xx-1)日 00:00:00, xxxx年xx月(xx-1)日 23:59:59:999]
 */
export const pastYear = (diff=-1, isDuration=0) => periodPastYear(diff, undefined, isDuration);
// formatDateLocal(pastYear(),1);//[ '2018-5-6 00:00:00', '2019-5-5 23:59:59' ]
// formatDateLocal(pastYear(-5),1);//[ '2014-5-6 00:00:00', '2019-5-5 23:59:59' ]
// console.log(pastYear(-5,1)/YEAR); // 5.002739725995688


//--------------------------------------------
//【未来】起止时间区间|区间时长 不含今天
//--------------------------------------------
/**
 * 起止时间|时长 【之后diff天（不含今天）】
 * @description 获取之后diff天的开始时间和结束时间
 * @param {*} diff 相差天数  diff ∈ Z﹢(正整数)
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认明天时间区间 [xxxx年xx月(xx+1)日 00:00:00, xxxx年xx月(xx+1)日 23:59:59:999] 
 */
export const laterDay = (diff=1, isDuration=0) => periodLaterDay(diff, undefined, isDuration);
// formatDateLocal(laterDay(-1),1);
/**
 * 起止时间|时长 【之后diff周（不含今天）】
 * @description 获取之后diff周的起止时间 
 * @param {*} diff 相差周数 diff ∈ Z﹢(正整数)
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认之后一周时间区间 [xxxx年xx月(xx+1)日 00:00:00, xxxx年xx月(xx+7)日 23:59:59:999] 
 */
export const laterWeek = (diff=1, isDuration=0) => periodLaterWeek(diff, undefined, isDuration);
// formatDateLocal(laterWeek(1),1); 
/**
 * 起止时间|时长 【之后diff个月(不含今天)】
 * @description 获之后diff个月的起止时间
 * @param {*} diff 相差月数  diff ∈ Z﹢(正整数)
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认后一个月时间区间 [xxxx年xx月(xx+1)日 00:00:00, xxxx年(xx+1)月(xx+1)日 23:59:59:999]
 */
export const laterMonth = (diff=1, isDuration=0) => periodLaterMonth(diff, undefined, isDuration);
// formatDateLocal(laterMonth(),1); 
/**
 * 起止时间|时长 【之后diff年(不含今天)】
 * @description 获取之后diff年的起止时间
 * @param {*} diff 相差月数 diff ∈ Z﹢(正整数)
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认之后一年时间区间 [xxxx年xx月(xx+1)日 00:00:00, (xxxx+1)年xx月(xx+1)日 23:59:59:999]
 */
export const laterYear = (diff=1, isDuration=0) => periodLaterYear(diff, undefined, isDuration);
// formatDateLocal(laterYear(),1); 



//-----------------------------------------
// 【最近】时间区间|长度  含今天 有过去和将来区分
//  ** recentXXX为非精确化之前兼容处理 建议使用时态区分方法 [nextXXX,lastXXX]
//-----------------------------------------
/**
 * 起止时间 【过去全部有效日期（含今天）】
 * @description 获取全部的起止时间，包括今天
 */
export const lastAlltime = () => {
  return [new Date('2015/9/1 0:0:0'), DAY_END(new Date())];
};
export const alltime = lastAlltime;
// formatDateLocal(alltime(),1); //[ '2015-9-1 00:00:00', '2019-5-6 23:59:59' ]

/**
 * 起止时间|时长  【最近diff天(含今天)】
 * @description 获取最近diff天的开始时间和结束时间 包括今天
 *  过去 xxxx年xx月(xx-diff)日 00:00:00.000～xxxx年xx月xx日 23:59:59.999
 *  将来 xxxx年xx月xx日 00:00:00.000～ xxxx年xx月(xx+N)日 23:59:59.999
 *  ** recentDay为非精确化之前兼容处理 建议使用时态区分方法 [nextDay,lastDay]
 * 
 * @param {*} diff 相差天数  diff ∈ Z(整数)  <0 过去  =0 当下  >0将来
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认当天时间区间 [xxxx年xx月xx日 00:00:00, xxxx年xx月xx日 23:59:59:999] 
 */
export const recentDay = (diff=0, isDuration=0) => periodRecentDay(diff, undefined, isDuration);
// 起止时间|时长  【未来diff天(含今天)】   diff ∈ Z﹣(负整数)  默认明天
export const nextDay = (diff=1, isDuration=0) =>{
  diff<1 && (diff=1);
  return recentDay(diff, isDuration);
} 
// 起止时间|时长  【过去diff天(含今天)】   diff ∈ Z﹣(负整数)  默认昨天
export const lastDay = (diff=-1, isDuration=0) => {
  diff>-1 && (diff=-1);
  return recentDay(diff, isDuration);
};
//  formatDateLocal(recentDay(),1); //[ '2019-5-6 00:00:00', '2019-5-6 23:59:59' ]
//  formatDateLocal(lastDay(-3),1); //[ '2019-5-6 00:00:00', '2019-5-6 23:59:59' ]
// formatDateLocal(lastDay(),1);//[ '2019-5-5 00:00:00', '2019-5-6 23:59:59' ]
//  formatDateLocal(nextDay(),1); //[ '2019-5-6 00:00:00', '2019-5-7 23:59:59' ]


/**
 * 起止时间|时长  【最近diff周(含今天)】
 * @description 获取最近diff周的起止时间，包括今天 
 *  过去 xxxx年xx月(xx+diff*7)日 00:00:00.000～xxxx年xx月xx日 23:59:59.999
 *  将来 xxxx年xx月xx日 00:00:00.000～ xxxx年xx月(xx+diff*7)日 23:59:59.999
 *  ** recentWeek为非精确化之前兼容处理 建议使用时态区分方法 [nextWeek,lastWeek]
 *
 * @param {*} diff 相差周数 diff ∈ Z(整数) <0 过去  >=0未来   （缺省|undefined|0|1 等效）
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认过去一周时间区间 [xxxx年xx月(xx-1-7)日 00:00:00, xxxx年xx月xx日 23:59:59:999]
 */
export const recentWeek = (diff=-1, isDuration=0) => periodRecentWeek(diff, undefined, isDuration);
// 起止时间|时长  【未来diff周(含今天)】   diff ∈ Z﹣(负整数)  默认将来一周（缺省|undefined|0|1 等效）
export const nextWeek = (diff=1, isDuration=0) =>{
  diff<1 && (diff=1);
  return recentWeek(diff, isDuration);
} 
// 起止时间|时长  【过去diff周(含今天)】   diff ∈ Z﹣(负整数)  默认过去一周（缺省|undefined|0|-1 等效）
export const lastWeek = (diff=-1, isDuration=0) => {
  diff>-1 && (diff=-1);
  return recentWeek(diff, isDuration);
};
// formatDateLocal(recentWeek(),1); 
// formatDateLocal(nextWeek(-1),1);
// formatDateLocal(lastWeek(),1);//[ '2019-4-28 00:00:00', '2019-5-6 23:59:59' ]
// formatDateLocal(lastWeek(-5),1);//[ '2019-3-31 00:00:00', '2019-5-6 23:59:59' ]
// console.log(lastWeek(-5,1)/WEEK); // 5.285714284060846


/**
 * 起止时间|时长  【最近diff个月(含今天)】
 * @description 获取最近diff个月的起止时间，包括今天
 *  过去 xxxx年(xx+diff)月xx+1日 00:00:00.000～xxxx年xx月xx日 23:59:59.999
 *  将来 xxxx年xx月xx日 00:00:00.000～ xxxx年(xx+diff)月xx日 23:59:59.999
 * @param diff 相差月数  diff ∈ Z(整数)  <0 过去  =0 当下  >0将来
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认过去一个月时间区间 [xxxx年(xx-1)月xx日 00:00:00, xxxx年xx月xx日 23:59:59:999] 
 */
export const recentMonth = (diff=-1,isDuration=0) => periodRecentMonth(diff, undefined, isDuration);
// 起止时间|时长  【未来diff月(含今天)】   diff ∈ Z﹣(负整数)  默认将来一月（缺省|undefined|0|1 等效）
export const nextMonth = (diff=1, isDuration=0) =>{
  diff<1 && (diff=1);
  return recentMonth(diff, isDuration);
} 
// 起止时间|时长  【过去diff月(含今天)】   diff ∈ Z﹣(负整数)  默认过去一月（缺省|undefined|0|-1 等效）
export const lastMonth = (diff=-1, isDuration=0) => {
  diff>-1 && (diff=-1);
  return recentMonth(diff, isDuration);
};
// formatDateLocal(recentMonth(),1); 
// formatDateLocal(nextMonth(3),1);
// formatDateLocal(lastMonth(),1);//[ '2019-4-6 00:00:00', '2019-5-6 23:59:59' ]
// formatDateLocal(lastMonth(-5),1);//[ '2018-12-6 00:00:00', '2019-5-6 23:59:59' ]
// console.log(lastMonth(-5,1)/MONTH); //5.066666666280864

/**
 * 起止时间|时长  【最近diff年(含今天)】
 * @description获取最近diff年的起止时间，包括今天
 * @param diff 相差年数  diff ∈ Z(整数)  <0 过去  =0 当下  >0将来
 * @param isDuration 是否取时长  0-区间(默认)|1-时长
 * @return {[startDate, endDate] | periodTime} 默认过去一年时间区间  [(xxxx-1)年xx月xx日 00:00:00, xxxx年xx月xx日 23:59:59:999] 
 */
export const recentYear = (diff=-1,isDuration=0) => periodRecentYear(diff, undefined, isDuration);;
// 起止时间|时长  【未来diff年(含今天)】   diff ∈ Z﹣(负整数)  默认将来一年（缺省|undefined|0|1 等效）
export const nextYear = (diff=1, isDuration=0) =>{
  diff<1 && (diff=1);
  return recentYear(diff, isDuration);
} 
// 起止时间|时长  【过去diff年(含今天)】   diff ∈ Z﹣(负整数)  默认过去一年（缺省|undefined|0|-1 等效） 
export const lastYear = (diff=-1, isDuration=0) => {
  diff>-1 && (diff=-1);
  return recentYear(diff, isDuration);
};
// formatDateLocal(recentYear(),1);
// formatDateLocal(nextYear(3),1);
// formatDateLocal(lastYear(),1);//[ '2018-5-6 00:00:00', '2019-5-6 23:59:59' ]
// formatDateLocal(lastYear(-5),1);//[ '2014-5-6 00:00:00', '2019-5-6 23:59:59' ]
// console.log(lastYear(-5,1)/YEAR); //5.005479452023085

//-----------------------------------------
// 【快捷日期】时间区间|长度  
//  @return {Array.Date} [ xxxx年(xx-1)月xx日 00:00:00, xxxx年(xx-1)月xx日 23:59:59:999]
//-----------------------------------------
export const today = () => recentDay();
export const tomorrow = () => laterDay();
export const yesterday = () => pastDay();
// formatDateLocal(yesterday(),1);
// formatDateLocal(today(),1);
// formatDateLocal(tomorrow(),1);


// //==========================================
// 计算常量
//==========================================
/**
 * 快捷选择【最近过去时间区间(含今天)】
 * @description 时间段选择组件，默认使用的快捷选项 
 * @type {Array}
 */
export const LastShortcuts = [
  {
    text: '昨天',
    section: yesterday(),
  },
  {
    text: '最近一周', // 过去
    section: lastWeek(),
  },
  {
    text: '最近一个月', // 过去
    section: lastMonth(),
  },
];
// console.log(LastShortcuts);
/**
 * 快捷选择【最近未来时间区间(含今天)】
 * @description 时间段选择组件，默认使用的快捷选项 
 * @type {Array}
 */
export const NextShortcuts = [
  {
    text: '明天',
    section: tomorrow(),
  },
  {
    text: '未来一周',
    section: nextWeek(),
  },
  {
    text: '未来一个月',
    section: nextMonth(),
  },
];
// console.log(recentNextShortcuts);
/**
 * 快捷选择【之后时间区间(不含今天)】
 * @description 时间段选择组件，默认使用的快捷选项 
 * @type {Array}
 */
export const LaterShortcuts = [
  {
    text: '明天',
    section: tomorrow(),
  },
  {
    text: '之后一周',
    section: laterWeek(),
  },
  {
    text: '之后一个月',
    section: laterMonth(),
  },
];

/**
 * 快捷选择【过去时间区间(不含今天)】
 * @description 时间段选择组件，默认使用的快捷选项 
 * @type {Array}
 */
export const PastShortcuts = [
  {
    text: '昨天',
    section: yesterday(),
  },
  {
    text: '过去一周',
    section: pastWeek(),
  },
  {
    text: '过去一个月',
    section: pastMonth(),
  },
];

export const defaultShortcuts = PastShortcuts;
