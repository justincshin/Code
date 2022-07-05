import React, { useState } from 'react';
import '@fullcalendar/react';
import AddEditDates from './AddEditDates';
import debug from 'sabio-debug';
import { useEffect } from 'react';
import locationAvailabilityExceptionsService from '../../../services/locationAvailabilityExceptionsService';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import BootstrapTheme from '@fullcalendar/bootstrap';
import * as listingService from '../../../services/listingService';
import PropTypes from 'prop-types';

const _logger = debug.extend('CalendarApp');
const CalendarApp = (props) => {
    const [blockOutDates, setBlockOutDates] = useState({
        id: 0,
        start: '',
        end: '',
        title: '',
        className: 'bg-success',
    });

    const [listingsAll, setListingsAll] = useState({ listings: [] });
    _logger(listingsAll);

    const getListingSuccess = (data) => {
        _logger(data.data.item);
        setBlockOutDates((prevState) => {
            const pd = { ...prevState };
            pd.id = data.data.item.id;
            pd.title = 'Listing ' + data.data.item.listingId + ' Block Off Dates';
            pd.start = data.data.item.dateStart;
            pd.end = data.data.item.dateEnd;
            _logger(pd);
            return pd;
        });
    };

    const onListingIdError = (err) => {
        _logger(err);
    };

    const newEvents = [blockOutDates];
    _logger(blockOutDates);
    _logger(newEvents);

    useEffect(() => {
        _logger('useEffect to load calendar');
        locationAvailabilityExceptionsService
            .getByListingId(blockOutDates.id)
            .then(getListingSuccess)
            .catch(onListingIdError);
        listingService.getCreateby(0, 50, props.currentUser.id).then(allListingsSuccess).catch(allListingsError);
    }, []);

    const allListingsSuccess = (response) => {
        _logger(response);
        setListingsAll((prevState) => {
            const lAll = { ...prevState };
            lAll.listings = response.data.item.pagedItems;
            return lAll;
        });
    };

    const allListingsError = (err) => {
        _logger(err);
    };

    return (
        <React.Fragment>
            <div className="container">
                <div className="row mx-5 my-3">
                    <div className="col-12">
                        <h1>Listing Availability Exceptions Calendar</h1>
                    </div>
                </div>
            </div>

            <AddEditDates
                listingIdEvents={newEvents}
                blockOutDates={blockOutDates}
                setBlockOutDates={setBlockOutDates}
                listingsAll={listingsAll.listings}
                setListingsAll={setListingsAll}></AddEditDates>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <>
                            <div id="calendar">
                                <FullCalendar
                                    initialView="dayGridMonth"
                                    plugins={[
                                        dayGridPlugin,
                                        interactionPlugin,
                                        timeGridPlugin,
                                        listPlugin,
                                        BootstrapTheme,
                                    ]}
                                    handleWindowResize={true}
                                    themeSystem="bootstrap"
                                    buttonText={{
                                        today: 'Today',
                                        month: 'Month',
                                        week: 'Week',
                                        day: 'Day',
                                        list: 'List',
                                        prev: 'Prev',
                                        next: 'Next',
                                    }}
                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                                    }}
                                    editable={true}
                                    selectable={true}
                                    droppable={true}
                                    events={newEvents}
                                />
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
CalendarApp.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isLoggedIn: PropTypes.bool,
    }),
};
export default React.memo(CalendarApp);
