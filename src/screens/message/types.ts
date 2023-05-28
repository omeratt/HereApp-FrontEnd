interface IMessagesProps {
  message?: IMessageValues;
}
interface IMessageValues {
  _id?: string;
  title: string;
  message: string;
  date?: Date;
  createdAt?: string;
}
