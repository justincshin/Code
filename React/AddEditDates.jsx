import React, { useState, useRef } from 'react';
import debug from 'Portfolio-debug';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import locationAvailabilityExceptionsService from '../../../services/locationAvailabilityExceptionsService';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import formValidationSchema from './formValidationSchema';

const _logger = debug.extend('AddEditDates');
const AddEditDates = (props) => {
    const handleSubmit = (values) => {
        _logger(values);

        const newValues = {
            ListingId: values.ListingId,
            DateStart: values.DateStart,
            DateEnd: values.DateEnd,
        };
        const payload = newValues;
        _logger(payload);
        props.setBlockOutDates((prevState) => {
            const pd = { ...prevState };
            pd.end = newValues.DateEnd;
            pd.start = newValues.DateStart;
            pd.title = 'Listing ' + newValues.ListingId + ' Block Off Dates';

            _logger(pd);
            return pd;
        });

        locationAvailabilityExceptionsService.addDates(payload).then(postSuccess).catch(postError);
    };

    const postSuccess = (values) => {
        _logger(values);

        toastr.success('You have a new block off date now');
    };

    const postError = (err) => {
        _logger(err);
        toastr.error('Listing id does not exist');
    };

    const [listingId, setListingId] = useState({
        ListingId: 0,
    });
    _logger(listingId);

    const listId = useRef();
    _logger(listId);

    const handleListing = () => {
        setListingId((prevState) => {
            const li = { ...prevState };
            li.ListingId = listId.current.values.ListingId;
            _logger(li);
            return li;
        });
        locationAvailabilityExceptionsService
            .getByListingId(listId.current.values.ListingId)
            .then(getListingSuccess)
            .catch(onListingIdError);
    };

    const getListingSuccess = (data) => {
        _logger(data);

        props.setBlockOutDates((prevState) => {
            const pd = { ...prevState };
            pd.id = data.data.item.listingId;
            pd.title = 'Listingggg ' + data.data.item.listingId + ' Block Off Dates';
            pd.start = data.data.item.dateStart;
            pd.end = data.data.item.dateEnd;
            _logger(pd);
            return pd;
        });
    };
    const onListingIdError = (err) => {
        _logger(err);
        toastr.error('Listing block dates does not exist');
    };

    const listingIdEvent = props.listingIdEvents;
    _logger(listingIdEvent);

    const mapListingsData = (data) => {
        return (
            <option value={data.id} key={`listing_${data.id}`}>
                {data.title}
            </option>
        );
    };

    const id = listingId.ListingId;
    _logger(props.listingsAll.indexOf(id));
    _logger(id);
    _logger(props.listingsAll.map(mapListingsData));

    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <Formik
                            enableReinitialize={true}
                            initialValues={props.blockOutDates}
                            onSubmit={handleSubmit}
                            events={listingIdEvent}
                            validationSchema={formValidationSchema}
                            innerRef={listId}>
                            {({ values, handleChange }) => (
                                <Form>
                                    <h4>Select Listing From Dropdown Below</h4>
                                    <div className="form-group">
                                        <label htmlFor="listingId">Listing: </label>
                                        <Field
                                            component="select"
                                            name="ListingId"
                                            className="form-control"
                                            placeholder="Select Listing Id Here"
                                            value={values.ListingId}
                                            onChange={handleChange}>
                                            <option>Select Listing Here</option>
                                            {props.listingsAll.map(mapListingsData)}
                                        </Field>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="title">Enter Title</label>
                                        <Field
                                            type="text"
                                            name="title"
                                            className="form-control"
                                            placeholder="Ex: Name + Block Off Dates "
                                            onChange={handleChange}
                                            value={values.title}></Field>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="startDate">Start Date</label>
                                        <Field
                                            type="date"
                                            name="DateStart"
                                            className="form-control"
                                            onChange={handleChange}
                                            value={values.startDate}
                                        />
                                        <ErrorMessage
                                            name="DateStart"
                                            component="div"
                                            className="has-error"></ErrorMessage>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="endDate">End Date</label>
                                        <Field
                                            type="date"
                                            name="DateEnd"
                                            className="form-control"
                                            onChange={handleChange}
                                            value={values.endDate}
                                        />
                                        <ErrorMessage
                                            name="DateEnd"
                                            component="div"
                                            className="has-error"></ErrorMessage>
                                    </div>
                                    <button type="submit" className="btn btn-primary my-3">
                                        Add New Date Block
                                    </button>
                                    <button type="submit" className="btn btn-primary my-3 mx-3" onClick={handleListing}>
                                        Show Listing Date Block
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
AddEditDates.propTypes = {
    listingsAll: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
        })
    ),
    event: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            start: PropTypes.string.isRequired,
            end: PropTypes.string.isRequired,
            title: PropTypes.number,
        })
    ),
    listingIdEvents: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            start: PropTypes.string.isRequired,
            end: PropTypes.string.isRequired,
            title: PropTypes.string,
        })
    ),
    blockOutDates: PropTypes.shape({
        id: PropTypes.number.isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        title: PropTypes.string,
    }),
    setBlockOutDates: PropTypes.func,
};

export default React.memo(AddEditDates);
