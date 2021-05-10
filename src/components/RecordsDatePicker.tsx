import React, { useEffect, useState } from "react";
import { Badge, useMediaQuery, useTheme } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { getRecordsCountOFMonthRequest, GetRecordsCountOfMonthResponse } from "../Api";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import { useStoreon } from "storeon/react";
import { Events, State } from "../store";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { format, getDate, getMonth } from "date-fns";

export class RuLocalizedUtils extends DateFnsUtils {
  getCalendarHeaderText(date: number | Date) {
    return format(date, "LLLL", { locale: this.locale });
  }

  getDatePickerHeaderText(date: number | Date) {
    return format(date, "dd MMMM", { locale: this.locale });
  }
}

export const RuFormat = "d MMM yyyy";

const RecordsDatePicker = () => {
  const [selectedDays, setSelectedDays] = useState<GetRecordsCountOfMonthResponse>([]);
  const [viewedDate, setViewedDate] = useState<MaterialUiPickersDate>(new Date());
  const { dispatch, recordsDate } = useStoreon<State, Events>("recordsDate");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const handleMonthChange = async (date: MaterialUiPickersDate) => {
    setViewedDate(date);
    date && getRecordsCountOFMonthRequest(date).then(days => setSelectedDays(days));
  };

  useEffect(() => {
    handleMonthChange(new Date()).then();
    // TODO: Пока так нужно, потом подумаю как переделать
    // eslint-disable-next-line
  }, []);

  const handleDateChange = (date: MaterialUiPickersDate) => {
    date && dispatch("records/setRecordsDate", date);
  };

  return (
    <MuiPickersUtilsProvider utils={RuLocalizedUtils} locale={ruLocale}>
      <KeyboardDatePicker
        format={RuFormat}
        onChange={handleDateChange}
        value={recordsDate}
        orientation={isMobile ? "portrait" : "landscape"}
        variant={isMobile ? "dialog" : "static"}
        openTo="date"
        inputVariant="outlined"
        fullWidth
        autoOk={true}
        onMonthChange={handleMonthChange}
        renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
          const monthOfDay = day && getMonth(day);
          const monthOfSelectedDate = viewedDate && getMonth(viewedDate);
          const numberOfDay = day && getDate(day);

          const foundedDay = selectedDays?.find(
            i => monthOfDay === monthOfSelectedDate && i.day === numberOfDay
          );

          return (
            <Badge color="error" badgeContent={foundedDay ? foundedDay.count : undefined}>
              {dayComponent}
            </Badge>
          );
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default RecordsDatePicker;
