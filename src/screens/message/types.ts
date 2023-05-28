interface IMessagesProps {
  message?: IValues;
}
interface IValues {
  _id?: string;
  title: string;
  message: string;
  date?: Date;
}
