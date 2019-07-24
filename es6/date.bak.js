/**
 * 所有与时间相关的通用方法写这里
 * @type {[type]}
 */
// import { default as  } from  './dateExact';
import {
  setOffsetDay,
  setOffsetWeek,
  setOffsetMonth,
  setOffsetYear,
  periodPastDay,
  periodPastMonth,
  periodPastYear,
  periodLaterDay,
  periodLaterMonth,
  periodLaterYear,
  periodRecentDay,
  periodRecentMonth,
  periodRecentYear
} from  './dateExact';
// import { paddingZero } from './number';

const format24Hour = (time) => {
  time = (time).toString().replace(/^\s|\s$/, '');
  time.length<2 && (time=`0${time}`);
  return time;
}
const paddingZero = format24Hour;

// console.log(dateExact);


//================================================
// 常量
//================================================
/**
 * 一天的时间长度
 * @type {[type]}
 */
export const DAY = 24 * 60 * 60 * 1000;
/**
 * 一周的时间长度
 * @type {[type]}
 */
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY;
export const YEAR = 365 * DAY;

export const WEEK_MAP = [
  '周日',
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
];




//================================================
// 工具 方法
//================================================
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

/**
 * 判断两个时间戳是否跨年了
 * @param  {[type]} startTime [description]
 * @param  {[type]} endTime   [description]
 * @return {[type]}           [description]
 */
export const crossYears = (startTime, endTime) => {
  return new Date(endTime).getFullYear() !== new Date(startTime).getFullYear();
};

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

export const day2hourlable =clock24Hours;

/**
 * 日期区间 天
 * @description 根据起止时间，转为按天的时间标签
 * @param  {[type]} startTime [description]
 * @param  {[type]} endTime   [description]
 * @return {[type]}           [description]
 */
export const periodDays = () => (startTime, endTime) => {
  const dayLabels = [];
  let format = 'MM/dd';
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

export const timesection2daylabel = periodDays;





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
 * @param {[timePoint][naturalDayPoint]} boundary 临界值取值规则
 * timePoint ∈ [-1,0,1]  -1 起始点[零点] 0 正点[即时即刻]  1 终止点[最后一刻]
 * naturalDayPoint ∈ [0,1]      当day∈ [29,30,31]是否取自然日  取自然日则为自然月最后一日
*/
export const addDay =  (diff=0, time = new Date(), boundary) => setOffsetDay(diff, time, boundary);
/* export const addDay = (count, time = new Date()) => {
  const date = new Date(time);
  date.setDate(date.getDate() + count);
  return date;
}; */
/**
 * 日期 周 差值
 * @param {*} diff 相差周数 diff为整数 Z
 * @param {*} time  Date对象，可选 不传时使用当前时间
 * @param {[timePoint][naturalDayPoint]} boundary 临界值取值规则
 * timePoint ∈ [-1,0,1]  -1 起始点[零点] 0 正点[即时即刻]  1 终止点[最后一刻]
 * naturalDayPoint ∈ [0,1]      当day∈ [29,30,31]是否取自然日  取自然日则为自然月最后一日
 * @return 默认取日期即时即刻
 */
export const addWeek = (diff=0, date=new Date(), boundary) => setOffsetWeek(diff, time, boundary);
/* export const addWeek = (count, time = new Date()) => {
  const date = new Date(time);
  date.setDate(date.getDate() + count * 7);
  return date;
}; */

/**
 * 日期月份 差值
 * @param {*} diff 相差月数 diff为整数 Z
 * @param {*} time  Date对象，可选 不传时使用当前时间
 * @param {[timePoint][naturalDayPoint]} boundary 临界值取值规则
 * timePoint ∈ [-1,0,1]  -1 起始点[零点] 0 正点[即时即刻]  1 终止点[最后一刻]
 * naturalDayPoint ∈ [0,1]      当day∈ [29,30,31]是否取自然日  取自然日则为自然月最后一日
 * @return 默认取日期自然日即时即刻
 */
export const addMonth = (diff, time = new Date(), boundary='01') => setOffsetMonth(diff, time, boundary);
/* export const addMonth = (count, time = new Date()) => {
  const date = new Date(time);
  date.setMonth(date.getMonth() + count);
  
  return date;
}; */

/**
 * 日期年份 差值
 * @param {*} diff 相差年数 diff为整数 Z
 * @param {*} time Date对象，可选，不传时使用当前时间
 * @param {[timePoint][naturalDayPoint]} boundary 临界值取值规则
 * timePoint ∈ [-1,0,1]  -1 起始点 0 正点[即时即刻]  1 终止点
 * naturalDayPoint ∈ [0,1]      当day∈ [29,30,31]是否取自然日  取自然日则为自然月最后一日
 * @result
 *  ① 当前日期天为1～28, 目标日期月份取同一天  如 2000-02-28 19年后 为 2019-02-28 
 *  ② 当前日期天为29,30,31 若目标月份不存在则取最后一天 如 2000-02-29 19年后 为 2019-02-28 
 */
export const addYear = (diff, time = new Date(), boundary='01') => setOffsetYear(diff, time, boundary);
/* export const addYear = (count, time = new Date()) => {
  const date = new Date(time);
  date.setFullYear(date.getFullYear() + count);
  return date;
}; */





//==============================================
// 起止时间区间 | 区间时长
//==============================================
/**
 * 起止时间 【全部有效日期（含今天）】
 * @description 获取全部的起止时间，包括今天
 */
export const alltime = () => {
  return [new Date('2015/9/1 0:0:0'), DAY_END(new Date())];
};
export const today = recentDay;
/**
 * 起止时间|时长 【明天】
 * @description 获取明天一天的开始时间和结束时间
 * @return {Array.Date} [00:00:00,23:59:59:999]
 */
export const tomorrow = laterDay;
/* export const tomorrow = () => {
  return [DAY_BEGIN(addDay(1)), DAY_END(addDay(1))];
}; */

export const yesterday = pastDay;

/**
 * 起止时间 【当前 前后】
 * @param startOffset [timeStamp] 距离今天的时间偏移，ms
 * @param endOffset [timeStamp] 距离今天的时间偏移，ms
 * @return {[type]} [description]
 */
export const getRangeDays = (startOffset, endOffset) => {
  return [
    DAY_BEGIN(new Date(Date.now() + startOffset)),
    DAY_END(new Date(Date.now() + endOffset)),
  ];
};


//--------------------------------------------
// 【过去/之前】时间区间|区间时长   不含今天
//--------------------------------------------
/**
 * 起止时间|时长  【全部有效时间(不含今天)】
 * @description 获取全部的起止时间，不包括今天
 */
export const pastAlltime = () => {
  return [new Date('2015/9/1 0:0:0'), DAY_END(addDay(-1))];
};
/**
 * 起止时间|时长  【过去diff天（不含今天）】
 * @description 获取过去diff天的开始时间和结束时间
 * @param {*} diff 相差天数  diff ∈ Z﹣(负整数)
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认昨天时间区间 [xxxx年xx月(xx-1)日 00:00:00, xxxx年xx月(xx-1)日 23:59:59:999] 
 */
export const pastDay = (diff=-1, isDuration=0) => periodPastDay(diff,null,isDuration);
/* export const pastDay = () => {
  return [DAY_BEGIN(addDay(-1)), DAY_END(addDay(-1))];
}; */

/**
 * 起止时间|时长  【过去diff周（不含今天）】
 * @description 获取过去diff周的起止时间 
 * @param {*} diff 相差周数  diff ∈ Z﹣(负整数)
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认过去一周时间区间 [xxxx年xx月(xx-7)日 00:00:00, xxxx年xx月(xx-1)日 23:59:59:999] 
 */
export const pastWeek = (diff=-1, isDuration) => pastDay(diff*7, isDuration);
/* export const pastWeek = (diff=1) => {
  return [DAY_BEGIN(addWeek(-1*diff)), DAY_END(addDay(-1))];
}; */

/**
 * 起止时间|时长  【过去diff个月(不含今天)】
 * @description 获取过去diff个月的起止时间
 * @param {*} diff 相差月数 diff ∈ Z﹣(负整数)
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认过去一个月时间区间 [xxxx年(xx-1)月(xx-1)日 00:00:00, xxxx年xx月(xx-1)日 23:59:59:999]
 */
export const pastMonth = (diff=-1, isDuration=0) => periodPastMonth(diff, isDuration);
/* export const pastMonth = (diff=-1) => {
  return [DAY_BEGIN(addMonth(diff)), DAY_END(addDay(-1))];
}; */

/**
 * 起止时间|时长  【过去diff年(不含今天)】
 * @description 获取过去diff年的起止时间
 * @param {*} diff 相差月数  diff ∈ Z﹣(负整数)
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认过去一年时间区间 [(xxxx-1)年xx月(xx-1)日 00:00:00, xxxx年xx月(xx-1)日 23:59:59:999]
 */
export const pastYear = (diff=-1, isDuration=0) => periodPastYear(diff, isDuration);
// export const pastYear = () => {
//   return [DAY_BEGIN(addYear(-1)), DAY_END(addDay(-1))];
// };


//--------------------------------------------
//【将来/之后】起止时间区间|区间时长     不含今天
//--------------------------------------------
/**
 * 起止时间|时长 【之后diff天（不含今天）】
 * @description 获取之后diff天的开始时间和结束时间
 * @param {*} diff 相差天数  diff ∈ Z﹢(正整数)
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认明天时间区间 [xxxx年xx月(xx+1)日 00:00:00, xxxx年xx月(xx+1)日 23:59:59:999] 
 */
export const laterDay = (diff=1, isDuration=0) => periodLaterDay(diff,null, isDuration);

/**
 * 起止时间|时长 【之后diff周（不含今天）】
 * @description 获取之后diff周的起止时间 
 * @param {*} diff 相差周数 diff ∈ Z﹢(正整数)
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认之后一周时间区间 [xxxx年xx月(xx+1)日 00:00:00, xxxx年xx月(xx+7)日 23:59:59:999] 
 */
export const laterWeek = (diff=1, isDuration) => laterDay(diff*7, isDuration);

/**
 * 起止时间|时长 【之后diff个月(不含今天)】
 * @description 获之后diff个月的起止时间
 * @param {*} diff 相差月数  diff ∈ Z﹢(正整数)
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认后一个月时间区间 [xxxx年xx月(xx+1)日 00:00:00, xxxx年(xx+1)月(xx+1)日 23:59:59:999]
 */
export const laterMonth = (diff=1, isDuration=0) => periodLaterMonth(diff, isDuration);

/**
 * 起止时间|时长 【之后diff年(不含今天)】
 * @description 获取之后diff年的起止时间
 * @param {*} diff 相差月数 diff ∈ Z﹢(正整数)
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认之后一年时间区间 [xxxx年xx月(xx+1)日 00:00:00, (xxxx+1)年xx月(xx+1)日 23:59:59:999]
 */
export const laterYear = (diff=1, isDuration=0) => periodLaterYear(diff, isDuration);


//-----------------------------------------
// 【最近】时间区间|长度  含今天 有过去和将来区分
//-----------------------------------------
/**
 * 起止时间|时长  【最近diff天(含今天)】
 * @description 获取最近diff天的开始时间和结束时间 包括今天
 *  过去 xxxx年xx月(xx-diff)日 00:00:00.000～xxxx年xx月xx日 23:59:59.999
 *  将来 xxxx年xx月xx日 00:00:00.000～ xxxx年xx月(xx+N)日 23:59:59.999
 * @param {*} diff 相差天数  diff ∈ Z(整数)  <0 过去  =0 当下  >0将来
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认当天时间区间 [xxxx年xx月xx日 00:00:00, xxxx年xx月xx日 23:59:59:999] 
 */
export const recentDay = (diff=0, isDuration=0) => periodRecentDay(diff, null, isDuration);
/* export const recentDay = () => {
  return [DAY_BEGIN(addDay(0)), DAY_END(addDay(0))];
}; */

/**
 * 起止时间|时长  【最近diff周(含今天)】
 * @description 获取最近diff周的起止时间，包括今天
 *  过去 xxxx年xx月(xx+diff*7)日 00:00:00.000～xxxx年xx月xx日 23:59:59.999
 *  将来 xxxx年xx月xx日 00:00:00.000～ xxxx年xx月(xx+diff*7)日 23:59:59.999
 * @param {*} diff 相差天数 diff ∈ Z(整数) <0 过去  =0 当下  >0将来
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认过去一周时间区间
 */
export const recentWeek = (diff=1, isDuration=0) => recentDay((diff*7-1), isDuration);
/* export const recentWeek = () => {
  return [DAY_BEGIN(addDay(1, addWeek(-1))), DAY_END(addDay(0))];
}; */

// 起止时间|时长  【未来一周(含今天)】  diff ∈ Z﹢(正整数)
export const nextWeek = (diff=1, isDuration=0) => recentWeek(diff, isDuration);
/* export const nextWeek = () => {
  return [DAY_BEGIN(new Date()), DAY_END(addDay(6))];
}; */
// 起止时间|时长  【过去一周(含今天)】   diff ∈ Z﹣(负整数)
export const lastWeek = recentWeek;

/**
 * 起止时间|时长  【最近diff个月(含今天)】
 * @description 获取最近diff个月的起止时间，包括今天
 *  过去 xxxx年(xx+diff)月xx+1日 00:00:00.000～xxxx年xx月xx日 23:59:59.999
 *  将来 xxxx年xx月xx日 00:00:00.000～ xxxx年(xx+diff)月xx日 23:59:59.999
 * @param diff 相差月数  diff ∈ Z(整数)  <0 过去  =0 当下  >0将来
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认过去一个月时间区间 [xxxx年(xx-1)月xx日 00:00:00, xxxx年xx月xx日 23:59:59:999] 
 */
export const recentMonth = (diff=-1,isDuration=0) => periodRecentMonth(diff, null, isDuration);
// export const recentMonth = (diff=-1) => {
//   return [DAY_BEGIN(addDay(1, addMonth(diff))), DAY_END(addDay(0))];
// };
// 起止时间|时长  【未来一个月(含今天)】 diff ∈ Z﹢(正整数)
export const nextMonth = (diff=1, isDuration=0) => recentMonth(diff, isDuration);
// 起止时间|时长  【过去一个月(含今天)】
export const lastMonth = recentMonth;

/**
 * 起止时间|时长  【最近diff年(含今天)】
 * @description获取最近diff年的起止时间，包括今天
 * @param diff 相差年数  diff ∈ Z(整数)  <0 过去  =0 当下  >0将来
 * @param isDuration 是否取时长，默认取区间
 * @return {[startDate, endDate] | periodTime} 默认过去一年时间区间  [(xxxx-1)年xx月xx日 00:00:00, xxxx年xx月xx日 23:59:59:999] 
 */
export const recentYear = (diff=-1,isDuration=0) => periodRecentYear(diff,null,isDuration);;
/* export const recentYear = () => {
  return [DAY_BEGIN(addDay(1, addYear(-1))), DAY_END(addDay(0))];
}; */
// 起止时间|时长  【未来一年(含今天)】 diff ∈ Z﹢(正整数)
export const nextYear = (diff=1, isDuration=0) => recentYear(diff, isDuration);
// 起止时间|时长  【过去一年(含今天)】 diff ∈ Z﹢(正整数)
export const lastYear = recentYear;




//==========================================
// 计算常量
//==========================================
/**
 * 快捷选择 最近过去时间区间 
 * @description 时间段选择组件，默认使用的快捷选项 
 * @type {Array}
 */
export const recentPastShortcuts = [
  {
    text: '昨天',
    section: pastDay(),
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
/**
 * 快捷选择 最近未来时间区间 
 * @description 时间段选择组件，默认使用的快捷选项 
 * @type {Array}
 */
export const recentNextShortcuts = [
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

/**
 * 快捷选择 之后时间区间 
 * @description 时间段选择组件，默认使用的快捷选项 
 * @type {Array}
 */
export const recentFeatureShortcuts = [
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
 * 快捷选择 过去时间区间 
 * @description 时间段选择组件，默认使用的快捷选项 
 * @type {Array}
 */
export const pastShortcuts = [
  {
    text: '昨天',
    section: pastDay(),
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

export const defaultShortcuts = pastShortcuts;
