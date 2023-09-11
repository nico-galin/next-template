import { toTitleCase } from 'utils/string';
import styles from './Navigation.module.scss';

interface Route {
  title: string;
  icon: string;
  path: string;
  showOnMobile: boolean;
}

const routes: Route[] = [
  {
    title: 'home',
    icon: '',
    path: '/',
    showOnMobile: true,
  },
  {
    title: 'Settings',
    icon: '',
    path: '/settings',
    showOnMobile: true,
  },
];

export default function Navigation() {
  return (
    <div className={styles.container}>
      {routes.map((route, routeIdx) => (
        <button key={routeIdx}>{toTitleCase(route.title)}</button>
      ))}
    </div>
  );
}
