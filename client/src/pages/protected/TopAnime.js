import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TitleCard from '../../components/Cards/TitleCard'
import { Link, useParams } from 'react-router-dom'
import SearchBar from "../../components/Input/SearchBar"
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import { openModal } from '../../features/common/modalSlice'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import axiosInstance from '../../app/axios'
import axios from 'axios'

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
    const [selectedFilters, setSelectedFilters] = useState([]);
    //const [searchText, setSearchText] = useState('');
    const typeFilters = ["TV", "Movie", "OVA", "Special", "ONA", "Music", "Unknown"];

    const addOrRemoveFilter = (filter) => {
        const index = selectedFilters.indexOf(filter);
        let updatedFilters = [...selectedFilters];

        if (index === -1) {
            updatedFilters.push(filter);
        } else {
            updatedFilters.splice(index, 1);
        }

        setSelectedFilters(updatedFilters);
    };

    const applyFilters = () => {
        applyFilter(selectedFilters);
    };

    const removeAppliedFilter = () => {
        removeFilter();
        setSelectedFilters([]);
        //setSearchText('');
    };
    /*
    const handleInputChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleApplySearch = () => {
        if (searchText === '') {
            removeAppliedFilter();
        } else {
            applySearch(searchText);
        }
    };
    */
    return (
        <div className="inline-block float-right">
            {/*
            <input
                type="text"
                value={searchText}
                onChange={handleInputChange}
                placeholder="Search..."
                className="mr-4"
            />
            */}
            
            {selectedFilters.length > 0 && (
                <button onClick={removeAppliedFilter} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">
                    {selectedFilters.join(', ')}<span className="ml-2">×</span>
                </button>
            )}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                    Filter
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {typeFilters.map((filter, index) => (
                        <li key={index}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.includes(filter)}
                                    onChange={() => addOrRemoveFilter(filter)}
                                    className="mr-2"
                                />
                                {filter}
                            </label>
                        </li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    <li>
                        <button onClick={applyFilters} >Apply</button>
                    </li>
                </ul>
            </div>
            
            {/*
            <button onClick={handleApplySearch} className="btn btn-secondary ml-2">
                Apply Search
            </button>
            */}
        </div>
    );
};

const WatchListButtons = ({id,name,img,state}) => {

    const dispatch = useDispatch()

    const openAddWatchListModal = () => {
        dispatch(openModal({title : "Update Watch Status", bodyType : MODAL_BODY_TYPES.WATCHLIST_ADD_NEW,extraObject:{"id":id,"name":name,"img":img,"state":state}}))
    }

    return(
        <div className="inline-block ">
            <button className="btn btn-sm normal-case btn-primary" onClick={() => openAddWatchListModal()}>Add Status</button>
        </div>
    )
}

const RatingButtons = ({id,name,img,state}) => {

    const dispatch = useDispatch()

    const openAddWatchListModal = () => {
        dispatch(openModal({title : "Update Rating Score", bodyType : MODAL_BODY_TYPES.RATING_ADD_NEW,extraObject:{"id":id,"name":name,"img":img,"state":state}}))
    }

    return(
        <div className="inline-block cursor-pointer" onClick={openAddWatchListModal}>
            <div className='flex'>⭐ <div className='ml-1 underline'>N/A</div></div>
            <div className='flex mt-1'>📝 <div className='ml-1 underline'>N/A</div></div>
            
        </div>
    )
}


function InternalPage(){    

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle({ title : "Top Anime Series"}))
      }, [])
    
    const [values, setValues] = useState()

    useEffect(() => {
        axiosInstance.get('/api/getAnimes').then(res => res.data).then(data => setValues(data));
    }, [])
    
    const removeFilter = () => {
        axiosInstance.get('/api/getAnimes').then(res => res.data).then(data => setValues(data));
    }

    const applyFilter = (params) => {
        let filteredTransactions = values.filter((t) => {return t.location == params})
        setValues(filteredTransactions)
    }

    // Search according to name
    const applySearch = (value) => {
        let filteredTransactions = values.filter((t) => {return t.email.toLowerCase().includes(value.toLowerCase()) ||  t.email.toLowerCase().includes(value.toLowerCase())})
        setValues(filteredTransactions)
    }


    return(
        <TitleCard title="Top Anime Series" topMargin="mt-2" TopSideButtons={<TopSideButtons applyFilter={applyFilter} removeFilter={removeFilter}/>}>
        <div className="overflow-x-auto w-full">
        <table className="table w-full">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Title</th>
                    <th>Score</th>
                    <th>Your Review</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                { values &&
                    values.map((l, k) => {
                        return(
                            <tr key={k}>
                                <td>
                                    <div className="flex items-center space-x-3">
                                        <div className='font-bold text-5xl'>{k+1}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className='flex'>
                                        <Link to={"../details/" + l.anime_id} className='flex'>
                                            <img className='max-h-24 flex' src={l["Image_URL"]} alt='img' />
                                        </Link>
                                        <div className='flex mx-5 flex-col'>
                                            <Link to={"../details/" + l.anime_id} className='flex'>
                                                <div className="font-bold  text-lg hover:underline">{l.Name}</div>
                                            </Link>
                                            <div className='mt-2 font-extralight text-sm'>{l.type} ( {l.Premiered!==-1?l.Premiered:'n/a'} )</div>
                                            <div className='mt-2 font-extralight text-sm'>{l.members?l.members:0} Members</div>
                                        </div>
                                    </div>
                                </td>
                                <td><div className="font-bold">⭐{0}</div></td>
                                <td><RatingButtons id={l["anime_id"]} img={l["Image_URL"]}  name={l["Name"]} /></td> 
                                <td><WatchListButtons id={l["anime_id"]} name={l["Name"]} img={l["Image_URL"]} state={l["state"]} /></td>                               
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </div>
    </TitleCard>
    )
}

export default InternalPage