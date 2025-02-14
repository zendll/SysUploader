
const colors = require('colors');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//1.5 s

const startBot = async () => {
  console.log("\n🔄 Iniciando BOT Aguarde...".dim);
  await delay(1500);

  console.log("✅ Banco de dados carregado...".green);
  await delay(1500); 

  console.log("✅ Comandos registrados carregados...".yellow);
  await delay(1500); 

  console.log("🔄 Aguarde...".gray);
  await delay(1500); 

  console.log("🔄 Processando é carregando dados do BOT...".gray);
  await delay(2000); 

  console.log("\n");
  console.log("\n");

  console.log("                               █▀▀▀█ █▀▀█ █▀▄▀█ █▀▀█   █▀▀█ █▀▀▀█ █▀▀▄ █▀▀▀" .magenta);
  console.log("                               ▀▀▀▄▄ █▄▄█ █▒█▒█ █▄▄█   █░░░ █░░▒█ █░▒█ █▀▀▀".magenta);
  console.log("                               █▄▄▄█ █░▒█ █░░▒█ █░░░   █▄▄█ █▄▄▄█ █▄▄▀ █▄▄▄\n".magenta);
  await delay(1000); 
  console.log("                                       ✅ Bot Online Versão 1.0.0".gray);
  await delay(1000); 
  console.log("                                 ✅ Bot SA-MP CODE desenvolvido por znx".gray);


  const { exec } = 
    require('child_process');

  exec('node index.js', (err, stdout, stderr) => {

    if (err) 
      return console.error(`Erro: ${err}`);
  
    console.log(`Saída: ${stdout}`);
    console.error(`Erro: ${stderr}`);

  });
};

startBot();
