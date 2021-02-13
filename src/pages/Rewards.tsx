import React, { useState } from 'react';
import { IonAlert, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Reward from '../model/Reward';
import RewardService from '../services/reward-service';
import { add, trophy } from 'ionicons/icons';
import useStore from '../hooks/use-store-hook';
import RewardItem from '../components/RewardItem';
import RewardForm from '../components/RewardForm';

const Rewards: React.FC = () => {

  const rewardService = RewardService()
  const [rewards, setRewards] = useState<Reward[]>()
  const [selectedReward, setSelectedReward] = useState<Reward>()
  const [showModal, setShowModal] = useState(false);

  useStore(rewardService, () => {
        rewardService.list()
        .then(result => {
            setRewards(result)
        },
        err => console.log(err));
    }
  )

  const clearModal = () => {
    setSelectedReward(undefined)
    setShowModal(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Rewards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color="success">
            <IonTitle size="large">Rewards</IonTitle>
          </IonToolbar>
        </IonHeader>
        {rewards?.map((reward) => {
          return <RewardItem key={reward.id} reward={reward} onPress={() => {
            setSelectedReward(reward)
            setShowModal(true)
          }}></RewardItem>
        })}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="danger" onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
         <IonModal isOpen={showModal} cssClass='my-custom-class'>
          <IonHeader>
            <IonToolbar color="success">
              <IonTitle>{selectedReward? 'Edit reward' : 'Add a new reward'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => {
                    clearModal()
                  }
                }>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <RewardForm
            selectedReward={selectedReward}
            onSave={() => {
              clearModal() 
            }}
            onDelete={() => {
              clearModal() 
            }
            }></RewardForm>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Rewards;
