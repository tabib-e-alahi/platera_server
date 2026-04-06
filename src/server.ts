import app from './app';
import envConfig from './config';

async function main() {
  try {
    app.listen(envConfig.port, () => {
      console.log(`Example app listening on port ${envConfig.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
