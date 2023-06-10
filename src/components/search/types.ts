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
  setSelectedTask?: React.Dispatch<
    React.SetStateAction<ITaskSearchResult | undefined>
  >;
  flashListHeight?: number;
  openTaskModal?: () => void;
}
export interface ISearchResult {
  lists: IListSearchResult[];
  tasks: ITaskSearchResult[];
  messages: IMessageSearchResult[];
}

export interface ITaskSearchResult extends TaskType {
  data: ISearchElement;
}
export interface IListSearchResult extends ListType {
  data: ISearchElement;
}
export interface IMessageSearchResult extends IMessageValues {
  data: ISearchElement;
}
