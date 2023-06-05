import {EventType, EventDetail} from '@notifee/react-native';

export const ACTION = {
  DISMISS: 'dismiss',
  DONE: 'done',
} as const;

export interface INotifeeHandler {
  type: EventType;
  detail: EventDetail;
}
