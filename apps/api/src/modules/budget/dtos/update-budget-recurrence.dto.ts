export interface UpdateBudgetRecurrenceDto {
  enabled?: boolean;

  /**
   * Amount to use for future generated budget periods.
   */
  budgetAmount?: number;

  /**
   * End date of the recurring budget series.
   * null = no recurrence end date.
   */
  endDate?: Date | null;
}