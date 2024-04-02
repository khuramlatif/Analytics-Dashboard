import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  MenuItem,
  Icon,
  Label,
  Menu,
  Table,
  Container,
  Flag
} from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'

interface ISale {
  Id: number;
  storeId: number;
  orderId: string;
  marketPlace?: string;
  storeName?: string;
  country?: string;
  latest_ship_date: string;
  shipment_status: string;
  destination: string;
  items: number;
  orderValue: number;
  overDueDays: number;
};

const SalesComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSort, setIsSort] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async (page: any, sorting: boolean) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/sales?page=${page}&pageSize=10&sortByDays=${sorting ? 1 : 0}`);
      const { sales, totalPages } = response.data;

      setSales(sales);
      setTotalPages(totalPages);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(currentPage, isSort);
  }, [currentPage, isSort]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSorting = () => {
    setIsSort(!isSort);
  };

  const handleSetFlag = (country?: string) => {
    if (country === 'AUS')
      return <Flag name='au' />;
    if (country === 'GBR')
      return <Flag name='uk' />;
    if (country === 'USA')
      return <Flag name='us' />;
    else return '';
  };

  return (
    <Container style={{ marginTop: '3em' }}>
      {loading && (
        <>
          <div className="ui active inverted dimmer">
            <div className="ui text loader">Loading</div>
          </div>
          <p></p>
        </>
      )}
      <Table sortable celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>MARKETPLACE</TableHeaderCell>
            <TableHeaderCell>STORE</TableHeaderCell>
            <TableHeaderCell>ORDER ID</TableHeaderCell>
            <TableHeaderCell>ORDER VALUE</TableHeaderCell>
            <TableHeaderCell>ITEM</TableHeaderCell>
            <TableHeaderCell>DESTINATION</TableHeaderCell>
            <TableHeaderCell sorted={isSort ? 'ascending' : 'descending'}
              onClick={handleSorting}>DAYS OVERDUE</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sales && sales.map((sale: ISale, index) => (
            <TableRow id={index}>
              <TableCell>
                {handleSetFlag(sale.country)} {sale.marketPlace}
              </TableCell>
              <TableCell>
                {sale.storeName}
              </TableCell>
              <TableCell>{sale.orderId}</TableCell>
              <TableCell>{'$'+sale.orderValue}</TableCell>
              <TableCell>{sale.items}</TableCell>
              <TableCell>{sale.destination}</TableCell>
              <TableCell error>{sale.overDueDays}</TableCell>
            </TableRow>
          ))}

        </TableBody>

        <TableFooter>
          <TableRow>
            <TableHeaderCell colSpan='7'>
              <Menu floated='right' pagination>
                <MenuItem as='a' icon onClick={handlePrevPage} disabled={currentPage === 1}>
                  <Icon name='chevron left' />
                </MenuItem>
                <MenuItem as='a'>1</MenuItem>
                <MenuItem as='a'>2</MenuItem>
                <MenuItem as='a'>3</MenuItem>
                <MenuItem as='a'>4</MenuItem>
                <MenuItem as='a' icon onClick={handleNextPage} disabled={currentPage === totalPages}>
                  <Icon name='chevron right' />
                </MenuItem>
              </Menu>
            </TableHeaderCell>
          </TableRow>
        </TableFooter>
      </Table>


    </Container>
  );
};

export default SalesComponent;