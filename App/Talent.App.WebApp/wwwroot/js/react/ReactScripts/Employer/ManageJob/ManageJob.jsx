import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() => { console.log("load dta"); }
        )

        //console.log(this.state.loaderData)

    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        console.log("loading data");
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs?showActive=true&showClosed=true&showExpired=true&showUnexpired=true';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here


       
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log("Here is the response!");
                console.log(res);
            }.bind(this)
        });
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of jobs </h1>
                    <div className="row"><Icon name='filter'></Icon>
                        <p style={{ display: "inline" }}>Filter: </p>
                        <Dropdown text='Choose Filter'>
                            <Dropdown.Menu>
                                <Dropdown.Item text='Active' />
                                <Dropdown.Item text='Closed' />
                                <Dropdown.Item text='Expired' />
                                <Dropdown.Item text='Unexpired' />
                                
                            </Dropdown.Menu>
                        </Dropdown>
                        <Icon name="calendar"> </Icon>
                        <p style={{ display: "inline" }}>Sort by date: </p>
                        <Dropdown text='Newest First'>
                            <Dropdown.Menu>
                                <Dropdown.Item text='Newest First' />
                                <Dropdown.Item text='Oldest First' />

                            </Dropdown.Menu>
                        </Dropdown>
                        </div>
                    
                </div>
            </BodyWrapper>

        )
    }
}