import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { fetchDrivers, overtakeDriver } from "./api/drivers";
import './App.css';
import { useState } from 'react';
import classNames from 'classnames';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Drivers />
    </QueryClientProvider>
  );
}

function Drivers() {
  const [overtakePos, setOvertakePos] = useState(-1);
  const queryClient = useQueryClient()

  const { data: drivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers
  })

  const { mutateAsync: overtakeDriverMutation } = useMutation({
    mutationFn: overtakeDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  return (
    <Stack className='grid' 
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}>
      {drivers?.sort((a, b) => a.place - b.place).map((driver) => 
        <Item className={classNames(
          'driver',
          {
            'first-place': driver.place === 1,
            'second-place': driver.place === 2,
            'third-place': driver.place === 3,
            'overtake': overtakePos === driver.place || overtakePos - 1 === driver.place
          })} 
          key={driver.id}>
          <div className={`place pos-${driver.place}`}>
            <div className='medal'>{driver.place}</div>
          </div>
          <div className='driver-img'>
            <img className='picture' src={`http://localhost:9000/images/${driver.code.toLowerCase()}.png`} />
            <img className='flag' src={`https://flagsapi.com/${driver.country}/flat/64.png`} />
          </div>
          <div className='name_container'>
            <div className='name'>{driver.firstname} {driver.lastname}</div>
            <div className='team'>{driver.team}</div>
          </div>
          <Button className='overtake_btn' variant='contained' onClick={async () => { 
            setOvertakePos(driver.place);
            await new Promise(w => setTimeout(w, 500));
            await overtakeDriverMutation(driver);
            await new Promise(w => setTimeout(w, 100));
            setOvertakePos(-1);
          }}>Overtake</Button>
        </Item>
      )}
    </Stack>
  )
}

export default App;
