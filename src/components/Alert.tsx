import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

export function Alert(props: Omit<AlertProps, 'elevation' | 'variant'>) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
