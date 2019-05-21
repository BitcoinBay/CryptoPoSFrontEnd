import React, { Component } from "react"; import PropTypes from "prop-types";
import { connect } from "react-redux";
import M from "materialize-css"

class CreatePoS extends Component {

    componentDidMount() {
        M.FormSelect.init(this.select);
    }

    render() {
        return(
            <div className="container">
                <div className="row" style={{ marginTop: "4rem" }}>
                    <div className="col s6 offset-s3">
                        <h4 className="page-header"
                                style={{ paddingLeft: "11px" }}>
                            Create a New Point-of-Sale
                        </h4>

                        <form novalidate>
                            <div className="input-field col s12">
                                <input id="pos_name" type="text"/>
                                <label htmlFor="pos_name">Point-of-sale name</label>
                            </div>

                            <div className="input-field col s12">
                                <input id="pos_xpub" type="text"/>
                                <label htmlFor="pos_xpub">Wallet xPub Address</label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

}

CreatePoS.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps)(CreatePoS);
