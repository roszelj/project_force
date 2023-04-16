/**
 *
 * TabNavigation
 *
 */
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ISOtoLocaleString } from 'utils/firestoreDateUtil';
import Button, { ButtonProps } from '@mui/material/Button';
import { stringToCurrency } from 'utils/currencyFormat';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface Props {
  payment_history: any;
  handlePayment: any;
  paymentCurrentInstallment: number;
  paymentSchedule: string;
  projectBalance: number;
}

export function TabNaviation({
  payment_history,
  handlePayment,
  paymentCurrentInstallment,
  paymentSchedule,
  projectBalance,
}: Props) {
  const [value, setValue] = React.useState(0);

  const theme = useTheme();

  console.log(paymentCurrentInstallment);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const _paymentSchedule = paymentSchedule.split('/')[1];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Payment Details"
          indicatorColor="primary"
          textColor="inherit"
        >
          <Tab label="Project Details" {...a11yProps(0)} />
          <Tab label="Payment Details" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div>Balance: {stringToCurrency(projectBalance)}</div>

        {projectBalance > 0 ? ( //DETERMINE IF THERE IS A BALANCE
          <Button variant="contained" size="large" onClick={handlePayment}>
            Checkout
          </Button>
        ) : (
          'Project Paid in Full'
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {payment_history.length ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 350 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="left">Type</TableCell>

                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payment_history.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="right">${row.amount}</TableCell>
                    <TableCell align="left">{row.paymentSchedule}</TableCell>

                    <TableCell align="right">
                      {ISOtoLocaleString(row.createdOn)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          'No Payment History Found'
        )}
      </TabPanel>
    </Box>
  );
}
