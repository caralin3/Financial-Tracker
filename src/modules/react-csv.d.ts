declare module 'react-csv' {
  interface HeaderData {
    key: string;
    label: string;
  }

  interface CSVLinkProps {
    asyncOnClick?: boolean;
    className?: string;
    data: any[];
    filename?: string;
    headers?: HeaderData[];
    onClick?: () => void;
    separator?: string;
  }

  export class CSVLink extends React.Component<CSVLinkProps> {}
}