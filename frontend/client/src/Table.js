import React, { useEffect, useState } from 'react';
import Berserkers10 from './contracts/Berserkers10.json';
import { getWeb3 } from './utils.js';

function TableData({ data, meta }) {
  const headerOrder = meta.map(m => m.key);
  const meta = [
    {
      key: 'id',
      text: 'ID',
      sort: true,
    },
    {
      key: 'name',
      text: 'Automobile Company',
      sort: true,
    },
    {
      key: 'age',
      text: 'Years Since Purchase',
      sort: true,
    },
    {
      key: 'color',
      text: 'Color',
      sort: true,
    },
  ]

    return(
      
    <thead className="table-row">
      {
        headers.map((d) => <TableCell data={d} />)
      }
    </thead>
    );

}

export default Table;
