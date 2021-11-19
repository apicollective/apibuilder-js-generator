import 'dd-trace/init';
import app from './app';

const port = process.env.APPLICATION_PORT || 7050;

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`apibuilder-javascript-generator listening on http://0.0.0.0:${port}`);
});
