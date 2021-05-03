import React, { useEffect, useState } from "react";
import { Badge } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { getRecordsCountOFMonthRequest, GetRecordsCountOfMonthResponse } from "../Api";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import { useStoreon } from "storeon/react";
import { Events, State } from "../store";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { getDate, getMonth } from "date-fns";

const RecordsDatePicker = () => {
  const [selectedDays, setSelectedDays] = useState<GetRecordsCountOfMonthResponse>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { dispatch, recordsDate } = useStoreon<State, Events>("recordsDate");

  const handleMonthChange = async () => {
    getRecordsCountOFMonthRequest(selectedDate).then(days => setSelectedDays(days));
  };

  useEffect(() => {
    handleMonthChange().then();
  }, []);

  const handleDateChange = (date: MaterialUiPickersDate) => {
    console.log("handleDateChange");

    if (date) {
      dispatch("records/setRecordsDate", date);
      setSelectedDate(date);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
      <KeyboardDatePicker
        onChange={handleDateChange}
        value={recordsDate}
        variant="inline"
        inputVariant="outlined"
        size="small"
        autoOk={true}
        onMonthChange={handleMonthChange}
        renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
          const monthOfDay = day && getMonth(day);
          const monthOfSelectedDate = selectedDate && getMonth(selectedDate);
          const numberOfDay = day && getDate(day);

          const foundedDay = selectedDays.find(
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
