import React, { useEffect, useState } from 'react';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router';
import Reward from '../model/Reward';
import RewardCard from '../components/RewardCard';
import RewardService from '../services/reward-service';
import { add } from 'ionicons/icons';

const Rewards: React.FC = () => {

  const rewardService = RewardService()
  const history = useHistory();
  let [rewards, setRewards] = useState<Reward[]>()

  useEffect(() => {
    const getRewards = () => {
        rewardService.list()
        .then(result => {
            setRewards(result)
        },
        err => console.log(err));
    }
    
    getRewards()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Rewards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Rewards</IonTitle>
          </IonToolbar>
        </IonHeader>
        {rewards?.map((reward) => {
          return <RewardCard key={reward.id} reward={reward} onPress={() => {
          }}></RewardCard>
        })}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Rewards;
