const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

function DisplayFreeSlots(props){
    return (
        <div>
            <p><b>Number of Free Slots: {25 - props.issues.length}</b></p>
        </div>
    );
}

function IssueRow(props) {
    const issue = props.issue;
    
    return (
      <tr>
        <td>{issue.SerialNo}</td>
        <td>{issue.Name}</td>
        <td>{issue.Phone}</td>
        <td>{issue.Timestamp.toISOString()}</td>
      </tr>
    );
}

function DisplayCustomers(props) {
    if(props.issues.length == 0) {
        return (
            <div>
                <p>The waitlist is currently empty.</p>
            </div>
        );
    }
    
    else {
    const issueRows = props.issues.map(issue =>
      <IssueRow key = {issue.SerialNo} issue={issue} />
    );

    return (
    <div>
    <p><b>Current Waitlist:</b></p>
      <table>
        <thead>
          <tr>
            <th>SerialNo</th>
            <th>Name</th>
            <th>Phone</th>
            <th>TimeStamp</th>
          </tr>
        </thead>
        <tbody>
          {issueRows}
        </tbody>
      </table>
    </div>
    );
    }
}

function DisplayHomepage(props){
    return (
        <div>
            <DisplayFreeSlots issues = {props.issues}/>
            <DisplayCustomers issues = {props.issues} />
            <input type = "button" value = "Add a Customer" onClick = {props.Add}/>
            <input type = "button" value = "Remove a Customer" onClick = {props.Delete} />
        </div>
    );
}

class AddCustomer extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      Name: form.name.value, Phone: form.phone.value,
    }
    this.props.createIssue(issue);
    form.name.value = ""; form.phone.value = "";
  }

  render() {
    return (
    <div className = {this.props.display1 ? "active" : "hide"}>
    <p><b>Please enter the customer information:</b></p>
      <form name="issueAdd" onSubmit={this.handleSubmit}>
          <label>Name: </label><input type="text" name="name" />
          <label>Phone: </label><input type="text" name="phone" />
        <button>Add</button>
      </form>
        <input type = "button" value = "Back to Homepage" onClick = {this.props.Back}/>
    </div>
    );
  } 
}
                
class DeleteCustomer extends React.Component {
  constructor() {
    super();
    this.handleSubmit1 = this.handleSubmit1.bind(this);
  }

  handleSubmit1(e) {
      
    e.preventDefault();
    const form = document.forms.issueDelete;
    const SerialNo = form.serialno.value;
    this.props.deleteIssue(SerialNo);
    form.serialno.value = ""; 
  }
    
  render() {
    return (
      <div className = {this.props.display2 ? "active" : "hide"}>
        <p><b>Please enter the serial number to delete a customer:</b></p>
            <form name="issueDelete" onSubmit={this.handleSubmit1}>
                <label>Serial No.: </label><input type="text" name="serialno" />
            <button>Delete</button>
            </form>
            <input type = "button" value = "Back to Homepage" onClick = {this.props.Back}/>
        </div>
    );
  }
}


async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [], display1: false, display2: false};
    this.createIssue = this.createIssue.bind(this);
      this.deleteIssue = this.deleteIssue.bind(this);
      this.Add = this.Add.bind(this);
      this.Delete = this.Delete.bind(this);
      this.Back = this.Back.bind(this);
  }
  
  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      issueList {
        SerialNo Name Phone Timestamp
      }
    }`;

    const data = await graphQLFetch(query);
    if (data.issueList) {
      this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    if(this.state.issues.length == 25) {
        alert ("Waitlist is already full!");
    }
    else {
        issue.SerialNo = this.state.issues.length + 1;
        for(var i = 0; i < this.state.issues.length; i++) {
            if(i+1 < this.state.issues[i].serialNo) {
                issue.SerialNo = i+1;
            }
        }
        issue.Timestamp = new Date();
        
        const query = `mutation issueAdd($issue: IssueInputs!) {
      	    issueAdd(issue: $issue) {
               _id
      	    }
    	}`;

    	const data = await graphQLFetch(query, { issue });
    	if (data) {
      	    this.loadData();
      	    alert("Added successfully!");
    	}
     }
  }
    
    async deleteIssue(SerialNo) {
        var flag = false;
        var index = 0;
        for (var i = 0; i < this.state.issues.length; i++) {
            if(this.state.issues[i].SerialNo == SerialNo) {
                flag = true;
                index = i;
                break;
            }
        }
        if(flag) {
            const customer = this.state.issues[index];
            const query = `mutation issueDelete($customer: IssueInputs!) {
      	       issueDelete(customer: $customer) {
      	          SerialNo
      	       }
    	    }`;
    	    const data = await graphQLFetch(query, { customer });
    	    if (data) {
      	        this.loadData();
      	        alert("Deleted successfully!");
    	    }
        }
        else {
            alert("Not customer in this slot!");
        }
    }

    Add() {
        this.setState({display1: true, display2: false});
    }

    Delete() {
        this.setState({display1: false, display2: true});
    }

    Back() {
        this.setState({display1: false, display2: false});
    }
    
  render() {
    return (
      <div class = "bg">
        <h1>Hotel California Waitlist System</h1>
        <DisplayHomepage issues={this.state.issues} Add = {this.Add} Delete = {this.Delete} />

        <AddCustomer createIssue={this.createIssue} display1 = {this.state.display1} Back = {this.Back} />

        <DeleteCustomer deleteIssue = {this.deleteIssue} display2 = {this.state.display2} Back = {this.Back} />
        
        </div>
    );
  }
}



const element = <IssueList />;

ReactDOM.render(element, document.getElementById('contents'));
