import { DashboardFilter } from "../enums/dashboard-filter.enum";


const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export function formatTimeSeriesData<T extends { _id: any }>(
  data: T[],
  filter: DashboardFilter,
) {
  return data.map((item) => {
    let label = "";

    switch (filter) {
      case DashboardFilter.TODAY:
        label = `${String(item._id.hour).padStart(2, "0")}:00`;
        break;

      case DashboardFilter.THIS_WEEK: {
        const date = new Date(
          item._id.year,
          item._id.month - 1,
          item._id.day,
        );

        label = WEEK_DAYS[date.getDay()];
        break;
      }

      case DashboardFilter.THIS_MONTH:
        label = `${item._id.day}`;
        break;

      case DashboardFilter.LAST_3_MONTHS:
      case DashboardFilter.LAST_6_MONTHS:
      case DashboardFilter.THIS_YEAR:
        label = MONTH_NAMES[item._id.month - 1];
        break;

      default:
        label = "";
    }

    const { _id, ...rest } = item;

    return {
      label,
      ...rest,
    };
  });
}