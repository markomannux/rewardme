import React, { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { book, water, fastFood} from 'ionicons/icons';
import './Settings.css';
import AchievementService from '../services/achievement-service';
import TaskService from '../services/task-service';
import RewardService from '../services/reward-service';
import useStore from '../hooks/use-store-hook';
import ConfigService from '../services/config-service'
import DatabaseService from '../services/database-service'

const Settings: React.FC = () => {

  const configService = ConfigService()
  const taskService = TaskService()
  const databaseService = DatabaseService()
  const achievementService = AchievementService()
  const rewardService = RewardService()
  const [tutorial, setTutorial] = useState(false)

  const tutorialCheckHandler = (checked: boolean) => {
    setTutorial(checked)
    configService.upsert({id: 'tutorial', value: checked? 'on':'off'})
  }

  useStore(configService, () => {
    configService.get('tutorial')
    .then(config => {
      if (!config) {
        setTutorial(true)
      } else {
        setTutorial(config.value === 'on')
      }
    })
  })

  async function resetDb() {
    await databaseService.reset()
  }

  async function clearDb() {
    await databaseService.clear()
  }

  async function initDb() {
    await databaseService.init()
    const reward1 = {
              id: '1',
              icon: water,
              name: '30 minutes of videogames 🎮'
            }
    const reward2 = {
              id: '2',
              icon: water,
              name: 'An episode of Star Trek 🖖'
    }
    const reward3 = {
              id: '3',
              icon: fastFood,
              name: 'One brioche 🥐'
    }
    const task1 = {
          id: '1',
          icon: book,
          name: 'Studying 1 hour'
        }
    const task2 = {
          id: '2',
          icon: water,
          name: 'Cleaning the kitchen'
        }
        
    await taskService.addAll([
      task1,
      task2
    ])

    await achievementService.addAll([
    {
        id: '1',
        date: new Date(),
        //date: '10/01/2021 10:20',
        task: task1,
        reward: reward1,
        spent: 'y'
    },       
    {
        id: '2',
        date: new Date(),
        //date: '10/01/2021 11:50',
        task: task2,
        reward: reward3,
        spent: 'n'
    }
    ])

    await rewardService.addAll([
      reward1,
      reward2,
      reward3
    ])
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color="success">
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton expand="block" onClick={resetDb}>Reset database</IonButton>
        <IonButton expand="block" onClick={clearDb}>Clear db</IonButton>
        <IonButton expand="block" onClick={initDb}>Init db</IonButton>
        <IonList>
          <IonItem routerLink="/settings/tasks">
            Setup tasks
          </IonItem>
          <IonItem routerLink="/settings/rewards">
            Setup rewards
          </IonItem>
          <IonItem>
            <IonLabel>Tutorial</IonLabel>
            <IonToggle checked={tutorial} onIonChange={e => tutorialCheckHandler(e.detail.checked)} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
