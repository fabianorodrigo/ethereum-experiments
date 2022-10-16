type Deploy = {
  value?: string | number | null;
  args: Record<string, string | number>;
  networks: Record<string, string> | any;
};

type Contract = Record<string, Deploy[]>;

type AppConfig = {
  ledger: {
    path: number;
    connect: boolean;
  };
  log: number;
  testNetwork: string;
  contract: Contract;
};
