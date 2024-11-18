import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import ButtonDismissPercent from './PercentDismissOfYear/ButtonDismissPercent';
import ButtonDepartmentMoves from './PercentDismissOfYear/ButtonDepartmentMoves';
import ButtonReportTermination from './PercentDismissOfYear/ButtonReportTermination';
import ButtonDaysLeavesForDepartment from './PercentDismissOfYear/ButtonDaysLeavesForDepartment';
import DaysLeavesForYear from './DaysLeavesForYear';
import ButtonDiversityOfSexs from './PercentDismissOfYear/ButtonDiversityOfSexs';
import ButtonLongevityEmployees from './PercentDismissOfYear/ButtonLongevityEmployees';
import ButtonDiversityNacionalities from './PercentDismissOfYear/ButtonDiversityNacionalities';
import ButtonExpensesByDepartments from './PercentDismissOfYear/ButtonExpensesByDepartments';
import ButtonExpensesByRanges from './PercentDismissOfYear/ButtonExpensesByRanges';

const SummariesContainer = () => {

  return (
    <div className='flex gap-2'>

      <ButtonDismissPercent />

      <ButtonDepartmentMoves />

      <ButtonReportTermination />

      <ButtonDaysLeavesForDepartment />
      
      <DaysLeavesForYear />

      <ButtonDiversityOfSexs />

      <ButtonLongevityEmployees />

      <ButtonDiversityNacionalities />

      <ButtonExpensesByDepartments />

      <ButtonExpensesByRanges />


    </div>
  )

}

export default SummariesContainer;
