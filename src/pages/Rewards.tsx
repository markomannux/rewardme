import React, { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Reward from '../model/Reward';
import RewardCard from '../components/RewardCard';
import RewardService from '../services/reward-service';
import { add, trophy } from 'ionicons/icons';

const Rewards: React.FC = () => {

  const rewardService = RewardService()
  const [rewards, setRewards] = useState<Reward[]>()
  const [showModal, setShowModal] = useState(false);
  const [rewardNameInput, setRewardNameInput] = useState<string | null>()


  useEffect(() => {
    const getRewards = () => {
        rewardService.list()
        .then(result => {
            setRewards(result)
        },
        err => console.log(err));
    }
    const handler = () => getRewards()
    rewardService.on('item:added', handler)
    rewardService.on('item:updated', handler)
    
    getRewards()

    return () => {
      rewardService.off('item:added', handler)
      rewardService.off('item:updated', handler)
    }
  }, [])

  const addReward = async () => {
    if (!rewardNameInput) {
      return
    }
    const reward: Reward = {
      name: rewardNameInput,
      icon: trophy
    }
    await rewardService.add(reward)
    setRewardNameInput(null)
    setShowModal(false)
  }

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
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
         <IonModal isOpen={showModal} cssClass='my-custom-class'>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add a Reward</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput value={rewardNameInput} required={true} onIonChange={e => setRewardNameInput(e.detail.value)}> </IonInput>
              </IonItem>
            </IonList>
            <IonButton onClick={() => addReward()} expand="block">Add</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Rewards;
