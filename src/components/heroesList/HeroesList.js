import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { heroDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice';
import Spinner from '../spinner/Spinner';
import HeroesListItem from "../heroesListItem/HeroesListItem";

import './heroesList.scss';

const HeroesList = () => {

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());

        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log('Ошибка при удалении. Статус: ' + err.status));
    }, []);

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, element, ...props}) => {
            return (
                <CSSTransition 
                    key={id} 
                    classNames={'card'}
                    timeout={500}
                >
                    <HeroesListItem onDelete={() => onDelete(id)} element={element} {...props}/>
                </CSSTransition>
            );
        })
    };

    if (heroesLoadingStatus === "loading") {
        return <Spinner />
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const elements = renderHeroesList(filteredHeroes);

    return (
        <TransitionGroup component={'ul'} >
                { elements }
        </TransitionGroup>
    )
}

export default HeroesList;