import { DashboardFilter } from "../enums/dashboard-filter.enum";

export function getDashboardDateRange(filter?: DashboardFilter) {
  const now = new Date();

  let startDate: Date;
  let endDate: Date;

  switch (filter ?? DashboardFilter.THIS_MONTH) {
    case DashboardFilter.TODAY:
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case DashboardFilter.THIS_WEEK: {
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day;

      startDate = new Date(now);
      startDate.setDate(now.getDate() + diff);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    }

    case DashboardFilter.LAST_3_MONTHS:
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      endDate = new Date();
      break;

    case DashboardFilter.LAST_6_MONTHS:
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      endDate = new Date();
      break;

    case DashboardFilter.THIS_YEAR:
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;

    case DashboardFilter.THIS_MONTH:
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      break;
  }

  return {
    startDate,
    endDate,
  };
}