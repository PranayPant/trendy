import { CircularProgress, Dialog } from '@material-ui/core';
import styles from './styles.module.css';

export default function Loader(props) {
   const { fullScreen = true, size = '15vw' } = props;
   return (
      <Dialog open={true} fullScreen={fullScreen}>
         <div className={styles.modalContainer}>
            <CircularProgress size={size} />
         </div>
      </Dialog>
   );
}
