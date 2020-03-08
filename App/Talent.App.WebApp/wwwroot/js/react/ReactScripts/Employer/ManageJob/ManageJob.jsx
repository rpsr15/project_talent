﻿import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Button, Image, Label, ButtonGroup } from 'semantic-ui-react';



class JobCard extends React.Component {


render() {
    let statusButton;
    if (this.props.status == 0) {
        statusButton = <Button size='tiny' color='green'>Active</Button>;
    } else {
        statusButton = <Button size='tiny' color='red'>Expired</Button>;
    }
        return (
            <Card style={{ width: "25rem", height: "22rem" }}>
                <Card.Content>

                    <Card.Header>{this.props.title}</Card.Header>
                    <Label color='black' ribbon='right'>
                        <Icon name='user'><span style={{ display: "inline-block", width: "8px" }}></span>0</Icon>
                    </Label>
                    <br />
                    <Card.Meta>{this.props.location.city + "," + this.props.location.country}</Card.Meta>
                    <Card.Description>{this.props.description.substring(0,200)}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {statusButton}
                   
                    <ButtonGroup style={{float:"right"}}>
                        <Button basic  color='blue' style={{ fontSize: "0.8rem"}} >
                            <Icon size='small' name='window close outline'/>
                                Close
                        </Button>
                        <Button basic size='tiny' color='blue' style={{ fontSize: "0.8rem"}} >
                            <Icon size='small' name='edit'/>
                                Edit
                        </Button>
                        <Button basic size='tiny' color='blue' style={{ fontSize: "0.8rem"}} >
                            <Icon size='small' name="copy outline"></Icon>    
                            Copy
                        </Button>
                            </ButtonGroup>
                    
                </Card.Content>
            </Card>
        );
    }
}
export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            totalPages:1,
            activePage: 1,
            startJob:0,
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
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
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
        console.log("intial page");
        var link = `http://localhost:51689/listing/listing/getSortedEmployerJobs?activePage=${this.state.activePage}&showActive=true&showClosed=true&showExpired=true&showUnexpired=true&limit=6`;
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
                console.log("Here is the response!",res);
                this.setState({
                    totalPages: Math.ceil(res.totalCount/6.0),
                    loadJobs: res.myJobs
                });
                console.log("here", res.myJobs);
                callback();
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
    handlePaginationChange(e, data) {

        var loader = this.state.loaderData;
       loader.isLoading = true;
        console.log("active page", data.activePage);
        this.setState({ activePage: data.activePage }, () => {
            this.loadData(function (res) {
                loader.isLoading = false;
                //this.setState({ loaderData })
                
            });
        });
        loader.isLoading = false;
       
        
    }

    render() {
        console.log("rendering", Math.ceil(this.state.loadJobs.length/6.0));

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

                    <p> </p>
                    <Card.Group itemsPerRow={3}>
                        {
                            this.state.loadJobs.map((job,i) => <JobCard key={job.id} title={job.title} location={job.location} description={job.summary} status={job.status} />)

                        }
                      
                    </Card.Group>
                    <div style={{ "textAlign": "center", "marginTop": "1rem", "marginBottom": "1rem" }}>
                        <Pagination
                            boundaryRange={0}
                            defaultActivePage={1}
                            ellipsisItem={null}
                            firstItem={null}
                            lastItem={null}
                            siblingRange={1}
                            onPageChange={this.handlePaginationChange}
                            totalPages={this.state.totalPages}
                        />
                    </div>


                </div>
            </BodyWrapper>

        )
    }
}