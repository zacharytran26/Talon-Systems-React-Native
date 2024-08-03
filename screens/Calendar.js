import React, { useState } from 'react';
import { Calendar, Text } from '@ui-kitten/components';

const CalendarSimpleUsageShowcase = () => {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Text category='h6'>
        Selected date: {' '}
        {date.toLocaleDateString()}
      </Text>

      <Calendar
        date={date}
        onSelect={nextDate => setDate(nextDate)}
      />
    </>
  );
};

export default CalendarSimpleUsageShowcase;
