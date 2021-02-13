import { IonAlert, IonButton, IonContent, IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
import React, { useState } from 'react';
import RewardService from '../services/reward-service';
import Reward from '../model/Reward';

interface RewardFormProps {
    selectedReward?: Reward
    onSave?: Function
    onDelete?: Function
}

const RewardForm: React.FC<RewardFormProps> = ({selectedReward, onSave, onDelete}) => {

  selectedReward = selectedReward || {
        name: ""
  }
    
  const rewardService = RewardService()
  const [showAlert, setShowAlert] = useState(false);
  const [rewardNameInput, setRewardNameInput] = useState<string | null | undefined>(selectedReward.name)


  const addReward = async () => {
    if (!rewardNameInput) {
      return
    }

    if (selectedReward) {
        selectedReward.name = rewardNameInput
        await rewardService.upsert(selectedReward)
        if (onSave) {
            onSave()
        }
    }
    
  }

  const deleteReward = async () => {
    if(selectedReward) {
      await rewardService.delete(selectedReward)
      if (onDelete) {
          onDelete()
      }
    }
  }

  let buttons
  if (selectedReward.id) {
    buttons = [<IonButton color="success" onClick={() => addReward()} expand="block">Update</IonButton>,
               <IonButton color="danger" onClick={() => setShowAlert(true)} expand="block">Delete</IonButton>]
  } else {
    buttons = <IonButton color="success" onClick={() => addReward()} expand="block">Add</IonButton>
  }
  return (
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
    )
}

export default RewardForm