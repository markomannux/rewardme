import React, { useState } from 'react';
import { IonAlert, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Reward from '../model/Reward';
import RewardCard from '../components/RewardCard';
import RewardService from '../services/reward-service';
import { add, trophy } from 'ionicons/icons';
import useStore from '../hooks/use-store-hook';
import RewardItem from '../components/RewardItem';

const Rewards: React.FC = () => {

  const rewardService = RewardService()
  const [rewards, setRewards] = useState<Reward[]>()
  const [selectedReward, setSelectedReward] = useState<Reward>()
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [rewardNameInput, setRewardNameInput] = useState<string | null>()

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
    setRewardNameInput(null)
    setShowModal(false)
  }

  const addReward = async () => {
    if (!rewardNameInput) {
      return
    }

    let reward: Reward | undefined = selectedReward
    if (!reward) {
      reward = {
        name: rewardNameInput,
        icon: trophy
      }
    }
    reward.name = rewardNameInput
    
    await rewardService.upsert(reward)
    clearModal()
  }

  const deleteReward = async () => {
    if(selectedReward) {
      await rewardService.delete(selectedReward)
    }
    clearModal()
  }

  let buttons
  if (selectedReward) {
    buttons = [<IonButton color="success" onClick={() => addReward()} expand="block">Update</IonButton>,
               <IonButton color="danger" onClick={() => setShowAlert(true)} expand="block">Delete</IonButton>]
  } else {
    buttons = <IonButton color="success" onClick={() => addReward()} expand="block">Add</IonButton>
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
            setRewardNameInput(reward.name)
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
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput value={rewardNameInput} required={true} onIonChange={e => setRewardNameInput(e.detail.value)}> </IonInput>
              </IonItem>
            </IonList>
            {buttons}
              <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              cssClass='my-custom-class'
              header={'Delete Reward'}
              message={'Do you really want to delete this reward?'}
              buttons={[{
                text: "Nope",
                role: 'cancel'
              },
              {
                text: "Yes, please!",
                handler: () => {
                  if (selectedReward) {
                    deleteReward()
                  }
                }
              }]}
            />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Rewards;
