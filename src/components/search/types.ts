import {TaskType} from '../../app/Reducers/User/userSlice';
import {ListType} from '../../assets/constants';

export interface ISearchElement {
  name: string;
  description: string;
}
export interface ISearchElementProps {
  id?: string;
  title?: string;
  items?: IListSearchResult[] | ITaskSearchResult[] | IMessageSearchResult[];
  navigateTo?: (id: string) => void;
}
export interface ISearchResult {
  lists: IListSearchResult[];
  tasks: ITaskSearchResult[];
  messages: IMessageSearchResult[];
}

interface ITaskSearchResult extends TaskType {
  data: ISearchElement;
}
interface IListSearchResult extends ListType {
  data: ISearchElement;
}
interface IMessageSearchResult extends IMessageValues {
  data: ISearchElement;
}
