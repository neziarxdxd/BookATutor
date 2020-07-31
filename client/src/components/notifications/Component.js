<TableBody>
                        {messages.slice(0, rowsPerPage).map(user => (
                          <TableRow
                            className={classes.tableRow}
                            hover
                            key={user.id}
                            selected={selectedUsers.indexOf(user._id) !== -1}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedUsers.indexOf(user._id) !== -1}
                                color="primary"
                                onChange={event => this.handleSelectOne(event, user._id)}
                                value="true"
                              />
                            </TableCell>
                            <TableCell>
                              <div className={classes.nameContainer}>
                                <Avatar
                                  className={classes.avatar}
                                  src={user.avatarUrl}
                                >
                                  {user.name}
                                </Avatar>
                                <Typography variant="body1">{user.name}</Typography>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.meetup}
                            </TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>
                              {user.time}
                            </TableCell>
                            <TableCell>
                              {user.duration}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>