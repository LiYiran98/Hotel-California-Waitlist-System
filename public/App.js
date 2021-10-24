const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

function DisplayFreeSlots(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Number of Free Slots: ", 25 - props.issues.length)));
}

function IssueRow(props) {
  const issue = props.issue;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, issue.SerialNo), /*#__PURE__*/React.createElement("td", null, issue.Name), /*#__PURE__*/React.createElement("td", null, issue.Phone), /*#__PURE__*/React.createElement("td", null, issue.Timestamp.toISOString()));
}

function DisplayCustomers(props) {
  if (props.issues.length == 0) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "The waitlist is currently empty."));
  } else {
    const issueRows = props.issues.map(issue => /*#__PURE__*/React.createElement(IssueRow, {
      key: issue.SerialNo,
      issue: issue
    }));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Current Waitlist:")), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "SerialNo"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Phone"), /*#__PURE__*/React.createElement("th", null, "TimeStamp"))), /*#__PURE__*/React.createElement("tbody", null, issueRows)));
  }
}

function DisplayHomepage(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DisplayFreeSlots, {
    issues: props.issues
  }), /*#__PURE__*/React.createElement(DisplayCustomers, {
    issues: props.issues
  }), /*#__PURE__*/React.createElement("input", {
    type: "button",
    value: "Add a Customer",
    onClick: props.Add
  }), /*#__PURE__*/React.createElement("input", {
    type: "button",
    value: "Remove a Customer",
    onClick: props.Delete
  }));
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
      Name: form.name.value,
      Phone: form.phone.value
    };
    this.props.createIssue(issue);
    form.name.value = "";
    form.phone.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: this.props.display1 ? "active" : "hide"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Please enter the customer information:")), /*#__PURE__*/React.createElement("form", {
      name: "issueAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("label", null, "Name: "), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "name"
    }), /*#__PURE__*/React.createElement("label", null, "Phone: "), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "phone"
    }), /*#__PURE__*/React.createElement("button", null, "Add")), /*#__PURE__*/React.createElement("input", {
      type: "button",
      value: "Back to Homepage",
      onClick: this.props.Back
    }));
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
    return /*#__PURE__*/React.createElement("div", {
      className: this.props.display2 ? "active" : "hide"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Please enter the serial number to delete a customer:")), /*#__PURE__*/React.createElement("form", {
      name: "issueDelete",
      onSubmit: this.handleSubmit1
    }, /*#__PURE__*/React.createElement("label", null, "Serial No.: "), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "serialno"
    }), /*#__PURE__*/React.createElement("button", null, "Delete")), /*#__PURE__*/React.createElement("input", {
      type: "button",
      value: "Back to Homepage",
      onClick: this.props.Back
    }));
  }

}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
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
    this.state = {
      issues: [],
      display1: false,
      display2: false
    };
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
      this.setState({
        issues: data.issueList
      });
    }
  }

  async createIssue(issue) {
    if (this.state.issues.length == 25) {
      alert("Waitlist is already full!");
    } else {
      issue.SerialNo = this.state.issues.length + 1;

      for (var i = 0; i < this.state.issues.length; i++) {
        if (i + 1 < this.state.issues[i].serialNo) {
          issue.SerialNo = i + 1;
        }
      }

      issue.Timestamp = new Date();
      const query = `mutation issueAdd($issue: IssueInputs!) {
      	    issueAdd(issue: $issue) {
               _id
      	    }
    	}`;
      const data = await graphQLFetch(query, {
        issue
      });

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
      if (this.state.issues[i].SerialNo == SerialNo) {
        flag = true;
        index = i;
        break;
      }
    }

    if (flag) {
      const customer = this.state.issues[index];
      const query = `mutation issueDelete($customer: IssueInputs!) {
      	       issueDelete(customer: $customer) {
      	          SerialNo
      	       }
    	    }`;
      const data = await graphQLFetch(query, {
        customer
      });

      if (data) {
        this.loadData();
        alert("Deleted successfully!");
      }
    } else {
      alert("Not customer in this slot!");
    }
  }

  Add() {
    this.setState({
      display1: true,
      display2: false
    });
  }

  Delete() {
    this.setState({
      display1: false,
      display2: true
    });
  }

  Back() {
    this.setState({
      display1: false,
      display2: false
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      class: "bg"
    }, /*#__PURE__*/React.createElement("h1", null, "Hotel California Waitlist System"), /*#__PURE__*/React.createElement(DisplayHomepage, {
      issues: this.state.issues,
      Add: this.Add,
      Delete: this.Delete
    }), /*#__PURE__*/React.createElement(AddCustomer, {
      createIssue: this.createIssue,
      display1: this.state.display1,
      Back: this.Back
    }), /*#__PURE__*/React.createElement(DeleteCustomer, {
      deleteIssue: this.deleteIssue,
      display2: this.state.display2,
      Back: this.Back
    }));
  }

}

const element = /*#__PURE__*/React.createElement(IssueList, null);
ReactDOM.render(element, document.getElementById('contents'));