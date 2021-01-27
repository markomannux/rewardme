import React, { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Reward from '../model/Reward';
import RewardCard from '../components/RewardCard';
import RewardService from '../services/reward-service';
import { add, trophy } from 'ionicons/icons';

const Rewards: React.FC = () => {

  const rewardService = RewardService()
  const [rewards, setRewards] = useState<Reward[]>()
  const [selectedReward, setSelectedReward] = useState<Reward>()
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
    rewardService.on('item:deleted', handler)
    
    getRewards()

    return () => {
      rewardService.off('item:added', handler)
      rewardService.off('item:updated', handler)
      rewardService.off('item:deleted', handler)
    }
  }, [])

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
    
    if (reward.id) {
      await rewardService.update(reward)
    }
    else await rewardService.add(reward)
    setSelectedReward(undefined)
    setRewardNameInput(null)
    setShowModal(false)
  }

  const deleteReward = async () => {
    
    if(selectedReward) {
      await rewardService.delete(selectedReward)
    }
    
    setSelectedReward(undefined)
    setRewardNameInput(null)
    setShowModal(false)
  }

  let buttons
  if (selectedReward) {
    buttons = [<IonButton onClick={() => addReward()} expand="block">Update</IonButton>,
               <IonButton color="danger" onClick={() => deleteReward()} expand="block">Delete</IonButton>]
  } else {
    buttons = <IonButton onClick={() => addReward()} expand="block">Add</IonButton>
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
            setSelectedReward(reward)
            setRewardNameInput(reward.name)
            setShowModal(true)
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
                <IonButton onClick={() => {
                    setSelectedReward(undefined)
                    setRewardNameInput(null)
                    setShowModal(false)
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
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Rewards;
