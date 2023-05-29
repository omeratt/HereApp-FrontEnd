interface ISearchElement {
  name: string;
  description: string;
}
interface ISearchElementProps {
  id?: string;
  title?: string;
  data?: ISearchElement[];
  navigateTo?: (id: string) => void;
}
